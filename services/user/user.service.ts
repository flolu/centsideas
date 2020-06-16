import * as faker from 'faker';
import {injectable, inject} from 'inversify';

import {EventTopics} from '@centsideas/enums';
import {MONGO_EVENT_STORE_FACTORY, MongoEventStoreFactory} from '@centsideas/event-sourcing';
import {UserId, Email, Timestamp} from '@centsideas/types';

import {UserConfig} from './user.config';
import {Username} from './username';
import {User} from './user';
import {PrivateUser} from './private-user';

@injectable()
export class UserService {
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
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
  ) {}

  async create(id: UserId, email: Email, createdAt: Timestamp) {
    // FIXME choose username based on email and/or google user name and/or location data
    const username = Username.fromString(faker.internet.userName());
    const user = User.create(id, username, createdAt);
    const privateUser = PrivateUser.create(id, email);
    await Promise.all([
      this.eventStore.store(user.flushEvents(), user.persistedAggregateVersion),
      this.privateEventStore.store(
        privateUser.flushEvents(),
        privateUser.persistedAggregateVersion,
      ),
    ]);
  }

  async rename(id: UserId, newUsername: Username) {
    //
  }

  async requestDeletion(id: UserId) {
    //
  }

  async confirmDeletion(id: UserId) {
    //
  }

  async requestEmailChange(id: UserId, newEmail: Email) {
    //
  }

  async confirmEmailChange(id: UserId) {
    //
  }

  // TODO give a way to fetch all personal data (probably needs to be orchestrated by gateway?)
}
