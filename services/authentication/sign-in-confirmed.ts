import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {SessionModels} from '@centsideas/models';
import {Timestamp, UserId, Email} from '@centsideas/types';

@DomainEvent(AuthenticationEventNames.SignInConfirmed)
export class SignInConfirmed implements IDomainEvent {
  constructor(
    public readonly isSignUp: boolean,
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly confirmedAt: Timestamp,
  ) {}

  serialize(): SessionModels.SignInConfirmedData {
    return {
      isSignUp: this.isSignUp,
      userId: this.userId.toString(),
      confirmedAt: this.confirmedAt.toString(),
      email: this.email.toString(),
    };
  }

  static deserialize({isSignUp, userId, confirmedAt, email}: SessionModels.SignInConfirmedData) {
    return new SignInConfirmed(
      isSignUp,
      UserId.fromString(userId),
      Email.fromString(email),
      Timestamp.fromString(confirmedAt),
    );
  }
}
