import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';
import {UserId, Email} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

@DomainEvent(PrivateUserEventNames.Created)
export class PrivateUserCreated implements IDomainEvent {
  constructor(public readonly id: UserId, public readonly email: Email) {}

  serialize(): UserModels.PrivateUserCreatedData {
    return {
      id: this.id.toString(),
      email: this.email.toString(),
    };
  }

  static deserialize({id, email}: UserModels.PrivateUserCreatedData) {
    return new PrivateUserCreated(UserId.fromString(id), Email.fromString(email));
  }
}
