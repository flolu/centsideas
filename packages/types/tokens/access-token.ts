import {UserId, SessionId} from '@centsideas/types';

import {Token} from './token';

interface SerializedAccessToken {
  userId: string;
  sessionId: string;
}

export class AccessToken extends Token<SerializedAccessToken> {
  constructor(public readonly sessionId: SessionId, public readonly userId: UserId) {
    super();
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<SerializedAccessToken>(token, secret);
    return new AccessToken(
      SessionId.fromString(decoded.sessionId),
      UserId.fromString(decoded.userId),
    );
  }

  protected get serializedPayload() {
    return {sessionId: this.sessionId.toString(), userId: this.userId.toString()};
  }
}
