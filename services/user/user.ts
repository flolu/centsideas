import {Aggregate, PersistedSnapshot, Apply} from '@centsideas/event-sourcing';
import {PersistedEvent} from '@centsideas/models';
import {UserId, ISODate} from '@centsideas/types';

import * as Errors from './user.errors';
import {Username} from './username';
import {UserCreated} from './user-created';
import {UserRenamed} from './user-renamed';
import {UserDeletionRequested} from './user-deletion-requested';
import {UserDeletionConfirmed} from './user-deletion-confirmed';

export interface SerializedUser {
  id: string;
  username: string;
  createdAt: string;
  deletedAt: string | undefined;
}

export class User extends Aggregate<SerializedUser> {
  protected id!: UserId;
  private username!: Username;
  private createdAt!: ISODate;
  private deletedAt: ISODate | undefined;

  static buildFrom(events: PersistedEvent[], snapshot?: PersistedSnapshot<SerializedUser>) {
    const user = new User();
    if (snapshot) user.applySnapshot(snapshot, events);
    else user.replay(events);
    return user;
  }

  protected deserialize(data: SerializedUser) {
    this.id = UserId.fromString(data.id);
    this.username = Username.fromString(data.username);
    this.createdAt = ISODate.fromString(data.createdAt);
    this.deletedAt = data.deletedAt ? ISODate.fromString(data.deletedAt) : undefined;
  }

  protected serialize(): SerializedUser {
    return {
      id: this.id.toString(),
      username: this.username.toString(),
      createdAt: this.createdAt.toString(),
      deletedAt: this.deletedAt ? this.deletedAt.toString() : undefined,
    };
  }

  static create(id: UserId, username: Username, createdAt: ISODate) {
    const user = new User();
    user.raise(new UserCreated(id, username, createdAt));
    return user;
  }

  rename(userId: UserId, username: Username) {
    this.checkGeneralConditions(userId);
    this.raise(new UserRenamed(username));
  }

  requestDeletion(userId: UserId) {
    this.checkGeneralConditions(userId);
    this.raise(new UserDeletionRequested());
  }

  confirmDeletion(userId: UserId, deletedAt: ISODate) {
    this.checkGeneralConditions(userId);
    this.raise(new UserDeletionConfirmed(deletedAt));
  }

  private checkGeneralConditions(userId: UserId) {
    if (!this.id.equals(userId)) throw new Errors.NoPermissionToAccessUser(this.id, userId);
    if (this.deletedAt) throw new Errors.UserAlreadyDeleted(this.id, userId);
  }

  @Apply(UserCreated)
  created(event: UserCreated) {
    this.id = event.id;
    this.username = event.username;
    this.createdAt = event.createdAt;
  }

  @Apply(UserRenamed)
  renamed(event: UserRenamed) {
    this.username = event.username;
  }

  @Apply(UserDeletionConfirmed)
  deletionConfirmed(event: UserDeletionConfirmed) {
    this.deletedAt = event.deletedAt;
  }
}
