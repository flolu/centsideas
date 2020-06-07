import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {SessionModels} from '@centsideas/models';
import {ISODate, UserId} from '@centsideas/types';

@DomainEvent(AuthenticationEventNames.SignInConfirmed)
export class SignInConfirmed implements IDomainEvent {
  constructor(
    public readonly isSignUpSession: boolean,
    public readonly userId: UserId,
    public readonly confirmedAt: ISODate,
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
      ISODate.fromString(confirmedAt),
    );
  }
}
