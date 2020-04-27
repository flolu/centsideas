import { injectable } from 'inversify';
import { Collection } from 'mongodb';

import { renameObjectProperty } from '@centsideas/utils';
import { UserEvents } from '@centsideas/enums';
import {
  IEmailChangeConfirmedEvent,
  IEmailChangeRequestedEvent,
  IUserUpdatedEvent,
  IUserCreatedEvent,
  IUserViewModel,
  IEvent,
} from '@centsideas/models';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class UsersProjection {
  private usersCollection!: Collection;

  constructor(private projectionDatabase: ProjectionDatabase) {
    this.initialize();
  }

  private initialize = async () => {
    this.usersCollection = await this.projectionDatabase.users();
  };

  handleEvent = async (event: IEvent) => {
    if (!this.usersCollection) {
      await this.initialize();
    }
    switch (event.name) {
      case UserEvents.UserCreated:
        return this.userCreated(event);
      case UserEvents.EmailChangeRequested:
        return this.emailChangeRequested(event);
      case UserEvents.EmailChangeConfirmed:
        return this.emailChangeConfirmed(event);
      case UserEvents.UserUpdated:
        return this.userUpdated(event);
    }
  };

  private userCreated = async (event: IEvent<IUserCreatedEvent>) => {
    const user: IUserViewModel = {
      id: event.aggregateId,
      username: event.data.username,
      createdAt: event.timestamp,
      lastEventId: event.id,
      private: {
        email: event.data.email,
        pendingEmail: null,
      },
    };
    const renamed = renameObjectProperty(user, 'id', '_id');
    await this.usersCollection.insertOne(renamed);
  };

  private emailChangeRequested = async (event: IEvent<IEmailChangeRequestedEvent>) => {
    await this.usersCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      { $set: { 'private.pendingEmail': event.data.email } },
    );
  };

  private emailChangeConfirmed = async (event: IEvent<IEmailChangeConfirmedEvent>) => {
    await this.usersCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          'private.email': event.data.newEmail,
          'private.pendingEmail': null,
        },
      },
    );
  };

  private userUpdated = async (event: IEvent<IUserUpdatedEvent>) => {
    await this.usersCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      { $set: { username: event.data.username } },
    );
  };
}
