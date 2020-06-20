import {Token} from './token';
import {SessionId} from '../identifiers';
import {Email} from '../email';

interface SerializedEmailSignInToken {
  sessionId: string;
  email: string;
}

export class EmailSignInToken extends Token<SerializedEmailSignInToken> {
  constructor(public readonly sessionId: SessionId, public readonly email: Email) {
    super();
  }

  static fromString(tokenString: string, secret: string) {
    const decoded = Token.decode<SerializedEmailSignInToken>(tokenString, secret);
    return new EmailSignInToken(
      SessionId.fromString(decoded.sessionId),
      Email.fromString(decoded.email),
    );
  }

  protected get serializedPayload() {
    return {
      sessionId: this.sessionId.toString(),
      email: this.email.toString(),
    };
  }
}
