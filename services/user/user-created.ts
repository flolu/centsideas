import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';
import {UserId, ISODate} from '@centsideas/types';

import {Username} from './username';

@DomainEvent(UserEventNames.Created)
export class UserCreated implements IDomainEvent {
  constructor(
    public readonly id: UserId,
    public readonly username: Username,
    public readonly createdAt: ISODate,
  ) {}

  serialize(): UserModels.UserCreatedData {
    return {
      id: this.id.toString(),
      username: this.username.toString(),
      createdAt: this.createdAt.toString(),
    };
  }

  static deserialize({id, username, createdAt}: UserModels.UserCreatedData) {
    return new UserCreated(
      UserId.fromString(id),
      Username.fromString(username),
      ISODate.fromString(createdAt),
    );
  }
}
