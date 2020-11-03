import {Token, Email, Id} from '@centsideas/common/types'
import {TokenExpiration} from '@centsideas/common/enums'

interface EmailSignInTokenPayload {
  email: string
  sessionId: string
}

export class EmailSignInToken extends Token<EmailSignInTokenPayload> {
  constructor(public readonly email: Email, public readonly sessionId: Id) {
    super(TokenExpiration.EmailSignIn)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<EmailSignInTokenPayload>(token, secret)
    return new EmailSignInToken(Email.fromString(decoded.email), Id.fromString(decoded.sessionId))
  }

  protected get serializedPayload() {
    return {
      email: this.email.toString(),
      sessionId: this.sessionId.toString(),
    }
  }
}
