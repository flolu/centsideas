import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';
import {Timestamp, UserId, Email} from '@centsideas/types';

@DomainEvent(UserEventNames.DeletionRequested)
export class UserDeletionRequested implements IDomainEvent {
  constructor(public readonly userId: UserId, public readonly requestedAt: Timestamp) {}

  serialize(): UserModels.DeletionRequestedData {
    return {
      userId: this.userId.toString(),
      requestedAt: this.requestedAt.toString(),
    };
  }

  static deserialize({userId, requestedAt}: UserModels.DeletionRequestedData) {
    return new UserDeletionRequested(UserId.fromString(userId), Timestamp.fromString(requestedAt));
  }
}
