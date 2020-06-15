import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {SessionModels} from '@centsideas/models';
import {Timestamp, UserId, SessionId, Email} from '@centsideas/types';

@DomainEvent(AuthenticationEventNames.GoogleSignInConfirmed)
export class GoogleSignInConfirmed implements IDomainEvent {
  constructor(
    public readonly sessionId: SessionId,
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly googleUserId: string,
    public readonly isSignUp: boolean,
    public readonly requestedAt: Timestamp,
    public readonly confirmedAt: Timestamp,
  ) {}

  serialize(): SessionModels.GoogleSignInConfirmedData {
    return {
      sessionId: this.sessionId.toString(),
      userId: this.userId.toString(),
      email: this.email.toString(),
      googleUserId: this.googleUserId.toString(),
      isSignUp: this.isSignUp,
      requestedAt: this.requestedAt.toString(),
      confirmedAt: this.confirmedAt.toString(),
    };
  }

  static deserialize({
    sessionId,
    userId,
    email,
    googleUserId,
    isSignUp,
    requestedAt,
    confirmedAt,
  }: SessionModels.GoogleSignInConfirmedData) {
    return new GoogleSignInConfirmed(
      SessionId.fromString(sessionId),
      UserId.fromString(userId),
      Email.fromString(email),
      googleUserId,
      isSignUp,
      Timestamp.fromString(requestedAt),
      Timestamp.fromString(confirmedAt),
    );
  }
}
