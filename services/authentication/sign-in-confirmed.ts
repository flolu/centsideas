import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {SessionModels} from '@centsideas/models';
import {Timestamp, UserId, Email} from '@centsideas/types';

@DomainEvent(AuthenticationEventNames.SignInConfirmed)
export class SignInConfirmed implements IDomainEvent {
  constructor(
    public readonly isSignUpSession: boolean,
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly confirmedAt: Timestamp,
  ) {}

  serialize(): SessionModels.SignInConfirmedData {
    return {
      isSignUpSession: this.isSignUpSession,
      userId: this.userId.toString(),
      confirmedAt: this.confirmedAt.toString(),
      email: this.email.toString(),
    };
  }

  static deserialize({
    isSignUpSession,
    userId,
    confirmedAt,
    email,
  }: SessionModels.SignInConfirmedData) {
    return new SignInConfirmed(
      isSignUpSession,
      UserId.fromString(userId),
      Email.fromString(email),
      Timestamp.fromString(confirmedAt),
    );
  }
}
