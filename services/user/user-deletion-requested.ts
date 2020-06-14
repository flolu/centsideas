import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';

@DomainEvent(UserEventNames.DeletionRequested)
export class UserDeletionRequested implements IDomainEvent {
  serialize(): UserModels.DeletionRequestedData {
    return {};
  }

  deserialize({}: UserModels.DeletionRequestedData) {
    return new UserDeletionRequested();
  }
}
