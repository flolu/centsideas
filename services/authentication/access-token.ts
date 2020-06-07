import {Token, UserId, SessionId} from '@centsideas/types';

interface AccessTokenData {
  userId: string;
  sessionId: string;
}

export class AccessToken extends Token<AccessTokenData> {
  constructor(public readonly sessionId: SessionId, public readonly userId: UserId) {
    super();
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<AccessTokenData>(token, secret);
    return new AccessToken(
      SessionId.fromString(decoded.sessionId),
      UserId.fromString(decoded.userId),
    );
  }

  get serializedPayload() {
    return {sessionId: this.sessionId.toString(), userId: this.userId.toString()};
  }
}
