import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';

import {SessionModels} from '@centsideas/models';
import {Email, Timestamp, SessionId} from '@centsideas/types';

import {SignInMethod} from './sign-in-method';

@DomainEvent(AuthenticationEventNames.SignInRequested)
export class SignInRequested implements IDomainEvent {
  constructor(
    public readonly sessionId: SessionId,
    public readonly method: SignInMethod,
    public readonly email: Email,
    public readonly requestedAt: Timestamp,
  ) {}

  serialize(): SessionModels.SignInRequestedData {
    return {
      sessionId: this.sessionId.toString(),
      method: this.method.toString(),
      email: this.email.toString(),
      requestedAt: this.requestedAt.toString(),
    };
  }

  static deserialize({sessionId, method, email, requestedAt}: SessionModels.SignInRequestedData) {
    return new SignInRequested(
      SessionId.fromString(sessionId),
      SignInMethod.fromString(method),
      Email.fromString(email),
      Timestamp.fromString(requestedAt),
    );
  }
}
