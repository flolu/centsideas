import 'reflect-metadata';

import {PersistedEvent, UserModels} from '@centsideas/models';
import {UserId, Email, ISODate} from '@centsideas/types';
import {EventId, PersistedSnapshot} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';

import {PrivateUser, SerializedPrivateUser} from './private-user';
import {PrivateUserCreated} from './private-user-created';
import {EmailChangeRequested} from './email-change-requested';
import {EmailChangeConfirmed} from './email-change-confirmed';
import {PrivateUserDeleted} from './private-user-deleted';
import * as Errors from './user.errors';

describe('Private User', () => {
  const id = UserId.generate();
  const otherUser = UserId.generate();
  const email = Email.fromString('hello@centsideas.com');
  const otherEmail = Email.fromString('other@centsideas.com');
  const timestamp = ISODate.now();

  let version = 1;
  const created: PersistedEvent<UserModels.PrivateUserCreatedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: PrivateUserEventNames.Created,
    data: {
      id: id.toString(),
      email: email.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const emailChangeRequested: PersistedEvent<UserModels.EmailChangeRequestedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: PrivateUserEventNames.EmailChangeRequested,
    data: {newEmail: otherEmail.toString()},
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const emailChangeConfirmed: PersistedEvent<UserModels.EmailChangeConfirmedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: PrivateUserEventNames.EmailChangeConfirmed,
    data: {},
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const deleted: PersistedEvent<UserModels.PrivateUserDeletedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: PrivateUserEventNames.Deleted,
    data: {deletedAt: timestamp.toString()},
    insertedAt: timestamp.toString(),
    sequence: version,
  };

  it('can be instantiated from events', () => {
    const events: PersistedEvent[] = [created, emailChangeRequested, emailChangeConfirmed, deleted];
    const privateUser = PrivateUser.buildFrom(events);

    expect(privateUser.persistedAggregateVersion).toEqual(events.length);
    expect(privateUser.aggregateVersion).toEqual(events.length);
    expect(privateUser.aggregateId.equals(id)).toEqual(true);

    const snapshot: PersistedSnapshot<SerializedPrivateUser> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        email: undefined,
        pendingEmail: undefined,
        deletedAt: timestamp.toString(),
      },
    };
    expect(privateUser.snapshot).toEqual(snapshot);
  });

  it('can be instantiated from events and a snapshot', () => {
    const events: PersistedEvent[] = [emailChangeConfirmed, deleted];
    const snapshot: PersistedSnapshot<SerializedPrivateUser> = {
      aggregateId: id.toString(),
      version: version - events.length,
      data: {
        id: id.toString(),
        email: email.toString(),
        deletedAt: undefined,
        pendingEmail: otherEmail.toString(),
      },
    };

    const privateUser = PrivateUser.buildFrom(events, snapshot);

    expect(privateUser.persistedAggregateVersion).toEqual(version);
    expect(privateUser.aggregateVersion).toEqual(version);
    expect(privateUser.aggregateId.equals(id)).toEqual(true);

    const updatedSnapshot: PersistedSnapshot<SerializedPrivateUser> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        email: undefined,
        deletedAt: timestamp.toString(),
        pendingEmail: undefined,
      },
    };
    expect(privateUser.snapshot).toEqual(updatedSnapshot);
  });

  it('creates users', () => {
    const privateUser = PrivateUser.create(id, email);
    expect(privateUser.flushEvents().toEvents()).toContainEqual(new PrivateUserCreated(id, email));
  });

  it('requests email changes', () => {
    const privateUser = PrivateUser.create(id, email);
    privateUser.requestEmailChange(id, otherEmail);
    expect(privateUser.flushEvents().toEvents()).toContainEqual(
      new EmailChangeRequested(otherEmail),
    );
  });

  it('confirms email changes', () => {
    const privateUser = PrivateUser.create(id, email);
    privateUser.requestEmailChange(id, otherEmail);
    privateUser.confirmEmailChange(id);
    expect(privateUser.flushEvents().toEvents()).toContainEqual(new EmailChangeConfirmed());
  });

  it('deletes users', () => {
    const privateUser = PrivateUser.create(id, email);
    privateUser.delete(id, timestamp);
    expect(privateUser.flushEvents().toEvents()).toContainEqual(new PrivateUserDeleted(timestamp));
  });

  it('prevents user other than the owner from access', () => {
    const privateUser = PrivateUser.create(id, email);
    expect(() => privateUser.requestEmailChange(otherUser, otherEmail)).toThrowError(
      new Errors.NoPermissionToAccessUser(id, otherUser),
    );
  });
});
