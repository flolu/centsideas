import {TokenExpiration} from '@centsideas/common/enums'
import {Email, Id, Token} from '@centsideas/common/types'

interface EmailChangeTokenPayload {
  userId: string
  currentEmail: string
  newEmail: string
}

export class EmailChangeToken extends Token<EmailChangeTokenPayload> {
  constructor(
    public readonly userId: Id,
    public readonly currentEmail: Email,
    public readonly newEmail: Email,
  ) {
    super(TokenExpiration.ChangeEmail)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<EmailChangeTokenPayload>(token, secret)
    return new EmailChangeToken(
      Id.fromString(decoded.userId),
      Email.fromString(decoded.currentEmail),
      Email.fromString(decoded.newEmail),
    )
  }

  protected get serializedPayload() {
    return {
      userId: this.userId.toString(),
      currentEmail: this.currentEmail.toString(),
      newEmail: this.newEmail.toString(),
    }
  }
}
