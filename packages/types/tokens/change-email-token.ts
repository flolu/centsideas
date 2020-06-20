import {Token} from './token';
import {UserId} from '../identifiers';
import {Email} from '../email';

interface SerializedChangeEmailToken {
  userId: string;
  newEmail: string;
}

export class ChangeEmailToken extends Token<SerializedChangeEmailToken> {
  constructor(public readonly userId: UserId, public readonly newEmail: Email) {
    super();
  }

  static fromString(tokenString: string, secret: string) {
    const decoded = Token.decode<SerializedChangeEmailToken>(tokenString, secret);
    return new ChangeEmailToken(
      UserId.fromString(decoded.userId),
      Email.fromString(decoded.newEmail),
    );
  }

  protected get serializedPayload() {
    return {
      userId: this.userId.toString(),
      newEmail: this.newEmail.toString(),
    };
  }
}
