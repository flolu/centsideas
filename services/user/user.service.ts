import * as faker from 'faker';
import {injectable, inject} from 'inversify';

import {EventTopics} from '@centsideas/enums';
import {MONGO_EVENT_STORE_FACTORY, MongoEventStoreFactory} from '@centsideas/event-sourcing';
import {UserId, Email, Timestamp, UserDeletionToken, ChangeEmailToken} from '@centsideas/types';
import {serializeEvent} from '@centsideas/rpc';
import {PersistedEvent} from '@centsideas/models';
import {SecretsConfig} from '@centsideas/config';

import {UserConfig} from './user.config';
import {Username} from './username';
import {User} from './user';
import {PrivateUser} from './private-user';
import * as Errors from './user.errors';

@injectable()
export class UserService {
  // FIXME type event store like `this.eventStoreFactory<SerialzedUser>`
  private eventStore = this.eventStoreFactory({
    url: this.config.get('user.database.url'),
    name: this.config.get('user.database.name'),
    topic: EventTopics.User,
  });
  private privateEventStore = this.eventStoreFactory({
    url: this.config.get('user.private_database.url'),
    name: this.config.get('user.private_database.name'),
    topic: EventTopics.PrivateUser,
  });

  constructor(
    private config: UserConfig,
    private secretsConfig: SecretsConfig,
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
  ) {}

  async create(id: string, email: string, createdAt: string) {
    const userId = UserId.fromString(id);
    // FIXME choose username based on email and/or google user name and/or location data
    const username = Username.fromString(faker.internet.userName());
    const user = User.create(userId, username, Timestamp.fromString(createdAt));
    const privateUser = PrivateUser.create(userId, Email.fromString(email));
    await this.storeAll(user, privateUser);
  }

  // TODO check if username is avaialble
  async rename(id: string, newUsername: string) {
    const userId = UserId.fromString(id);
    const user = await this.build(userId);
    user.rename(userId, Username.fromString(newUsername));
    await this.store(user);
  }

  async requestDeletion(id: string) {
    const userId = UserId.fromString(id);
    const user = await this.build(userId);
    user.requestDeletion(userId, Timestamp.now());
    await this.store(user);
  }

  async confirmDeletion(tokenString: string) {
    const token = UserDeletionToken.fromString(
      tokenString,
      this.secretsConfig.get('secrets.tokens.delete_user'),
    );
    const [user, privateUser] = await Promise.all([
      this.build(token.userId),
      this.buildPrivate(token.userId),
    ]);
    const timestamp = Timestamp.now();
    privateUser.delete(token.userId, timestamp);
    // TODO remove personal data from private user events
    user.confirmDeletion(token.userId, timestamp);
    await this.storeAll(user, privateUser);
  }

  async requestEmailChange(id: string, newEmail: string) {
    const userId = UserId.fromString(id);
    const privateUser = await this.buildPrivate(userId);
    privateUser.requestEmailChange(userId, Email.fromString(newEmail));
    await this.storePrivate(privateUser);
  }

  async confirmEmailChange(tokenString: string) {
    const token = ChangeEmailToken.fromString(
      tokenString,
      this.secretsConfig.get('secrets.tokens.change_email'),
    );
    const privateUser = await this.buildPrivate(token.userId);
    privateUser.confirmEmailChange(token.userId);
    await this.storePrivate(privateUser);
  }

  async getEvents(after?: number) {
    const events = await this.eventStore.getEvents(after || -1);
    return events.map(serializeEvent);
  }

  async getPrivateEvents(after?: number) {
    const events = await this.privateEventStore.getEvents(after || -1);
    return events.map(serializeEvent);
  }

  private async build(id: UserId) {
    const events: PersistedEvent[] = await this.eventStore.getStream(id);
    if (!events?.length) throw new Errors.UserNotFound(id);
    return User.buildFrom(events);
  }

  private async buildPrivate(id: UserId) {
    const events: PersistedEvent[] = await this.privateEventStore.getStream(id);
    if (!events?.length) throw new Errors.UserNotFound(id);
    return PrivateUser.buildFrom(events);
  }

  private store(user: User) {
    return this.eventStore.store(user.flushEvents(), user.persistedAggregateVersion);
  }

  private storePrivate(privateUser: PrivateUser) {
    return this.privateEventStore.store(
      privateUser.flushEvents(),
      privateUser.persistedAggregateVersion,
    );
  }

  private storeAll(user: User, privateUser: PrivateUser) {
    return Promise.all([
      this.eventStore.store(user.flushEvents(), user.persistedAggregateVersion),
      this.privateEventStore.store(
        privateUser.flushEvents(),
        privateUser.persistedAggregateVersion,
      ),
    ]);
  }

  // TODO give a way to fetch all personal data (probably needs to be orchestrated by gateway?)
}
