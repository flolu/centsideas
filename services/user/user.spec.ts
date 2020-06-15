import 'reflect-metadata';

import {UserId, ISODate} from '@centsideas/types';
import {PersistedEvent, UserModels} from '@centsideas/models';
import {PersistedSnapshot, EventId} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';

import {User, SerializedUser} from './user';
import {Username} from './username';
import {UserCreated} from './user-created';
import {UserRenamed} from './user-renamed';
import {UserDeletionConfirmed} from './user-deletion-confirmed';
import {UserDeletionRequested} from './user-deletion-requested';
import * as Errors from './user.errors';

describe('User', () => {
  const id = UserId.generate();
  const otherUser = UserId.generate();
  const timestamp = ISODate.now();
  const username = Username.fromString('mjdemarco');
  const otherUsername = Username.fromString('john');

  let version = 1;
  const created: PersistedEvent<UserModels.UserCreatedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: UserEventNames.Created,
    data: {
      id: id.toString(),
      username: username.toString(),
      createdAt: timestamp.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const renamed: PersistedEvent<UserModels.UserRenamedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: UserEventNames.Renamed,
    data: {username: otherUsername.toString()},
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const deletionRequested: PersistedEvent<UserModels.DeletionRequestedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: UserEventNames.DeletionRequested,
    data: {requestedAt: timestamp.toString()},
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const deletionConfirmed: PersistedEvent<UserModels.DeletionConfirmedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: UserEventNames.DeletionConfirmed,
    data: {deletedAt: timestamp.toString()},
    insertedAt: timestamp.toString(),
    sequence: version,
  };

  it('can be instantiated from events', () => {
    const events: PersistedEvent[] = [created, renamed, deletionRequested, deletionConfirmed];
    const user = User.buildFrom(events);

    expect(user.persistedAggregateVersion).toEqual(events.length);
    expect(user.aggregateVersion).toEqual(events.length);
    expect(user.aggregateId.equals(id)).toEqual(true);

    const snapshot: PersistedSnapshot<SerializedUser> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        username: otherUsername.toString(),
        createdAt: timestamp.toString(),
        deletedAt: timestamp.toString(),
        deletionRequestedAt: timestamp.toString(),
      },
    };
    expect(user.snapshot).toEqual(snapshot);
  });

  it('can be instantiated from events and a snapshot', () => {
    const events: PersistedEvent[] = [deletionRequested, deletionConfirmed];
    const snapshot: PersistedSnapshot<SerializedUser> = {
      aggregateId: id.toString(),
      version: version - events.length,
      data: {
        id: id.toString(),
        username: otherUsername.toString(),
        createdAt: timestamp.toString(),
        deletedAt: undefined,
        deletionRequestedAt: undefined,
      },
    };

    const user = User.buildFrom(events, snapshot);

    expect(user.persistedAggregateVersion).toEqual(version);
    expect(user.aggregateVersion).toEqual(version);
    expect(user.aggregateId.equals(id)).toEqual(true);

    const updatedSnapshot: PersistedSnapshot<SerializedUser> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        username: otherUsername.toString(),
        createdAt: timestamp.toString(),
        deletedAt: timestamp.toString(),
        deletionRequestedAt: timestamp.toString(),
      },
    };
    expect(user.snapshot).toEqual(updatedSnapshot);
  });

  it('creates user', () => {
    const user = User.create(id, username, timestamp);
    expect(user.flushEvents().toEvents()).toContainEqual(new UserCreated(id, username, timestamp));
  });

  it('renames user', () => {
    const user = User.create(id, username, timestamp);
    user.rename(id, otherUsername);
    expect(user.flushEvents().toEvents()).toContainEqual(new UserRenamed(otherUsername));
  });

  it('requests user deletion', () => {
    const user = User.create(id, username, timestamp);
    user.requestDeletion(id, timestamp);
    expect(user.flushEvents().toEvents()).toContainEqual(new UserDeletionRequested(timestamp));
  });

  it('deletes users', () => {
    const user = User.create(id, username, timestamp);
    user.requestDeletion(id, timestamp);
    user.confirmDeletion(id, timestamp);
    expect(user.flushEvents().toEvents()).toContainEqual(new UserDeletionConfirmed(timestamp));
  });

  it("cannot be deleted if deltion wasn't requested", () => {
    const user = User.create(id, username, timestamp);
    expect(() => user.confirmDeletion(id, timestamp)).toThrowError(
      new Errors.UserDeletionMustBeRequested(id),
    );
  });

  it('prevents actions if user is already deleted', () => {
    const user = User.create(id, username, timestamp);
    user.requestDeletion(id, timestamp);
    user.confirmDeletion(id, timestamp);
    expect(() => user.rename(id, otherUsername)).toThrowError(
      new Errors.UserAlreadyDeleted(id, id),
    );
  });

  it('rejects commands from users other than the owner', () => {
    const user = User.create(id, username, timestamp);
    expect(() => user.rename(otherUser, otherUsername)).toThrowError(
      new Errors.NoPermissionToAccessUser(id, otherUser),
    );
  });
});
