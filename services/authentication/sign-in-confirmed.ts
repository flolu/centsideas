import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {SessionModels} from '@centsideas/models';
import {Timestamp, UserId} from '@centsideas/types';

@DomainEvent(AuthenticationEventNames.SignInConfirmed)
export class SignInConfirmed implements IDomainEvent {
  constructor(
    public readonly isSignUpSession: boolean,
    public readonly userId: UserId,
    public readonly confirmedAt: Timestamp,
  ) {}

  serialize(): SessionModels.SignInConfirmedData {
    return {
      isSignUpSession: this.isSignUpSession,
      userId: this.userId.toString(),
      confirmedAt: this.confirmedAt.toString(),
    };
  }

  static deserialize({isSignUpSession, userId, confirmedAt}: SessionModels.SignInConfirmedData) {
    return new SignInConfirmed(
      isSignUpSession,
      UserId.fromString(userId),
      Timestamp.fromString(confirmedAt),
    );
  }
}
