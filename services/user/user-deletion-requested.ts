import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';
import {ISODate} from '@centsideas/types';

@DomainEvent(UserEventNames.DeletionRequested)
export class UserDeletionRequested implements IDomainEvent {
  constructor(public readonly requestedAt: ISODate) {}

  serialize(): UserModels.DeletionRequestedData {
    return {
      requestedAt: this.requestedAt.toString(),
    };
  }

  static deserialize({requestedAt}: UserModels.DeletionRequestedData) {
    return new UserDeletionRequested(ISODate.fromString(requestedAt));
  }
}
