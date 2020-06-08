import {Token, UserId, SessionId} from '@centsideas/types';

interface RefreshTokenData {
  userId: string;
  sessionId: string;
}

export class RefreshToken extends Token<RefreshTokenData> {
  constructor(public readonly sessionId: SessionId, public readonly userId: UserId) {
    super();
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<RefreshTokenData>(token, secret);
    return new RefreshToken(
      SessionId.fromString(decoded.sessionId),
      UserId.fromString(decoded.userId),
    );
  }

  get serializedPayload() {
    return {sessionId: this.sessionId.toString(), userId: this.userId.toString()};
  }
}
