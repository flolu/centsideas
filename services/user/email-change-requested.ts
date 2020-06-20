import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';
import {Email, UserId} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

@DomainEvent(PrivateUserEventNames.EmailChangeRequested)
export class EmailChangeRequested implements IDomainEvent {
  constructor(public readonly userId: UserId, public readonly newEmail: Email) {}

  serialize(): UserModels.EmailChangeRequestedData {
    return {
      userId: this.userId.toString(),
      newEmail: this.newEmail.toString(),
    };
  }

  static deserialize({userId, newEmail}: UserModels.EmailChangeRequestedData) {
    return new EmailChangeRequested(UserId.fromString(userId), Email.fromString(newEmail));
  }
}
