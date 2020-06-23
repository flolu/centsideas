import {Aggregate, PersistedSnapshot, Apply} from '@centsideas/event-sourcing';
import {PersistedEvent} from '@centsideas/models';
import {UserId, Timestamp, Username} from '@centsideas/types';

import * as Errors from './user.errors';
import {UserCreated} from './user-created';
import {UserRenamed} from './user-renamed';
import {UserDeletionRequested} from './user-deletion-requested';
import {UserDeletionConfirmed} from './user-deletion-confirmed';

export interface SerializedUser {
  id: string;
  username: string;
  createdAt: string;
  deletedAt: string | undefined;
  deletionRequestedAt: string | undefined;
}

export class User extends Aggregate<SerializedUser> {
  protected id!: UserId;
  private username!: Username;
  private createdAt!: Timestamp;
  private deletedAt: Timestamp | undefined;
  private deletionRequestedAt: Timestamp | undefined;

  static buildFrom(events: PersistedEvent[], snapshot?: PersistedSnapshot<SerializedUser>) {
    const user = new User();
    if (snapshot) user.applySnapshot(snapshot, events);
    else user.replay(events);
    return user;
  }

  protected deserialize(data: SerializedUser) {
    this.id = UserId.fromString(data.id);
    this.username = Username.fromString(data.username);
    this.createdAt = Timestamp.fromString(data.createdAt);
    this.deletedAt = data.deletedAt ? Timestamp.fromString(data.deletedAt) : undefined;
  }

  protected serialize(): SerializedUser {
    return {
      id: this.id.toString(),
      username: this.username.toString(),
      createdAt: this.createdAt.toString(),
      deletedAt: this.deletedAt ? this.deletedAt.toString() : undefined,
      deletionRequestedAt: this.deletionRequestedAt
        ? this.deletionRequestedAt.toString()
        : undefined,
    };
  }

  static create(id: UserId, username: Username, createdAt: Timestamp) {
    const user = new User();
    user.raise(new UserCreated(id, username, createdAt));
    return user;
  }

  rename(userId: UserId, username: Username) {
    this.checkGeneralConditions(userId);
    if (this.username.equals(username)) throw new Errors.UsernameNotChanged(username);
    this.raise(new UserRenamed(username));
  }

  requestDeletion(userId: UserId, requestedAt: Timestamp) {
    this.checkGeneralConditions(userId);
    this.raise(new UserDeletionRequested(requestedAt));
  }

  confirmDeletion(userId: UserId, deletedAt: Timestamp) {
    this.checkGeneralConditions(userId);
    if (!this.deletionRequestedAt) throw new Errors.UserDeletionMustBeRequested(userId);
    this.raise(new UserDeletionConfirmed(deletedAt));
  }

  private checkGeneralConditions(userId: UserId) {
    if (!this.id.equals(userId)) throw new Errors.NoPermissionToAccessUser(this.id, userId);
    if (this.deletedAt) throw new Errors.UserAlreadyDeleted(this.id, userId);
  }

  @Apply(UserCreated)
  protected created(event: UserCreated) {
    this.id = event.id;
    this.username = event.username;
    this.createdAt = event.createdAt;
  }

  @Apply(UserRenamed)
  protected renamed(event: UserRenamed) {
    this.username = event.username;
  }

  @Apply(UserDeletionRequested)
  protected deletionRequested(event: UserDeletionRequested) {
    this.deletionRequestedAt = event.requestedAt;
  }

  @Apply(UserDeletionConfirmed)
  protected deletionConfirmed(event: UserDeletionConfirmed) {
    this.deletedAt = event.deletedAt;
  }
}
