import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';
import {UserId, Timestamp, Username} from '@centsideas/types';

@DomainEvent(UserEventNames.Created)
export class UserCreated implements IDomainEvent {
  constructor(
    public readonly id: UserId,
    public readonly username: Username,
    public readonly createdAt: Timestamp,
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
      Timestamp.fromString(createdAt),
    );
  }
}
