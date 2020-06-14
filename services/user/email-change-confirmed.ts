import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';

@DomainEvent(PrivateUserEventNames.EmailChangeConfirmed)
export class EmailChangeConfirmed implements IDomainEvent {
  serialize(): UserModels.EmailChangeConfirmedData {
    return {};
  }

  deserialize({}: UserModels.EmailChangeConfirmedData) {
    return new EmailChangeConfirmed();
  }
}
