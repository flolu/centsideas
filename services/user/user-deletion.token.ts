import {TokenExpiration} from '@centsideas/common/enums'
import {Id, Token} from '@centsideas/common/types'

interface UserDeletionTokenPayload {
  userId: string
}

export class UserDeletionToken extends Token<UserDeletionTokenPayload> {
  constructor(public readonly userId: Id) {
    super(TokenExpiration.UserDeletion)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<UserDeletionTokenPayload>(token, secret)
    return new UserDeletionToken(Id.fromString(decoded.userId))
  }

  get serializedPayload() {
    return {
      userId: this.userId.toString(),
    }
  }
}
