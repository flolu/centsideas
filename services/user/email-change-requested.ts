import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';
import {Email} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

@DomainEvent(PrivateUserEventNames.EmailChangeRequested)
export class EmailChangeRequested implements IDomainEvent {
  constructor(public readonly newEmail: Email) {}

  serialize(): UserModels.EmailChangeRequestedData {
    return {
      newEmail: this.newEmail.toString(),
    };
  }

  static deserialize({newEmail}: UserModels.EmailChangeRequestedData) {
    return new EmailChangeRequested(Email.fromString(newEmail));
  }
}
