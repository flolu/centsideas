import {UserId} from '../identifiers';
import {Token} from './token';

interface UserDeletionTokenPayload {
  userId: string;
}

export class UserDeletionToken extends Token<UserDeletionTokenPayload> {
  constructor(public readonly userId: UserId) {
    super();
  }

  static fromString(tokenString: string, secret: string) {
    const decoded = Token.decode<UserDeletionTokenPayload>(tokenString, secret);
    return new UserDeletionToken(UserId.fromString(decoded.userId));
  }

  protected get serializedPayload() {
    return {
      userId: this.userId.toString(),
    };
  }
}
