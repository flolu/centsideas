import {Token, Id} from '@centsideas/common/types'
import {TokenExpiration} from '@centsideas/common/enums'

import {SerializedTokenUser, TokenUser} from './token-user'

interface AccessTokenPayload {
  sessionId: string
  user?: SerializedTokenUser
}

export class AccessToken extends Token<AccessTokenPayload> {
  constructor(public readonly sessionId: Id, public readonly user?: TokenUser) {
    super(TokenExpiration.Access)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<AccessTokenPayload>(token, secret)
    return new AccessToken(
      Id.fromString(decoded.sessionId),
      decoded.user
        ? TokenUser.fromObject({id: decoded.user.id, role: decoded.user.role})
        : undefined,
    )
  }

  protected get serializedPayload() {
    return {
      sessionId: this.sessionId.toString(),
      user: this.user ? {id: this.user.id.toString(), role: this.user.role.toString()} : undefined,
    }
  }
}
