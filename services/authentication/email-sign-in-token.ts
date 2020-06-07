import {Token, SessionId, Email} from '@centsideas/types';

interface EmailSignInTokenPayload {
  sessionId: string;
  email: string;
}

export class EmailSignInToken extends Token<EmailSignInTokenPayload> {
  constructor(public readonly sessionId: SessionId, public readonly email: Email) {
    super();
  }

  static fromString(tokenString: string, secret: string) {
    const decoded = Token.decode<EmailSignInTokenPayload>(tokenString, secret);
    return new EmailSignInToken(
      SessionId.fromString(decoded.sessionId),
      Email.fromString(decoded.email),
    );
  }

  get serializedPayload() {
    return {
      sessionId: this.sessionId.toString(),
      email: this.email.toString(),
    };
  }
}
