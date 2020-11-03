import {Token, Id} from '@centsideas/common/types'
import {TokenExpiration} from '@centsideas/common/enums'

import {SerializedTokenUser, TokenUser} from './token-user'

interface RefreshTokenPayload {
  sessionId: string
  count: number
  user?: SerializedTokenUser
}

export class RefreshToken extends Token<RefreshTokenPayload> {
  constructor(
    public readonly sessionId: Id,
    public readonly count: number,
    public readonly user?: TokenUser,
  ) {
    super(TokenExpiration.Refresh)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<RefreshTokenPayload>(token, secret)
    return new RefreshToken(
      Id.fromString(decoded.sessionId),
      decoded.count,
      decoded.user
        ? TokenUser.fromObject({id: decoded.user.id, role: decoded.user.role})
        : undefined,
    )
  }

  protected get serializedPayload() {
    return {
      sessionId: this.sessionId.toString(),
      count: this.count,
      user: this.user ? {id: this.user.id.toString(), role: this.user.role.toString()} : undefined,
    }
  }
}
