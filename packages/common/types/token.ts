import * as jwt from 'jsonwebtoken'

import {Exception} from './exception'
import {GenericErrors, RpcStatus} from '../enums'

export abstract class Token<T> {
  protected constructor(private readonly expiresInSeconds: number) {}

  static decode<T>(token: string, secret: string) {
    try {
      return (jwt.verify(token, secret) as any) as T
    } catch (error) {
      if (error.message === 'invalid signature') throw new InvalidTokenSecret()
      throw new InvalidToken(token)
    }
  }

  sign(secret: string, expiresInSeconds = this.expiresInSeconds) {
    return jwt.sign(Object(this.serializedPayload), secret, {expiresIn: expiresInSeconds})
  }

  protected abstract serializedPayload: T
}

export class InvalidToken extends Exception {
  name = GenericErrors.InvalidToken
  code = RpcStatus.INVALID_ARGUMENT

  constructor(invalidToken: string) {
    super(
      invalidToken ? `You provided an invalid token: ${invalidToken}` : 'No token was provided.',
    )
  }
}

export class InvalidTokenSecret extends Exception {
  name = GenericErrors.InvalidTokenSecret
  code = RpcStatus.INVALID_ARGUMENT

  constructor() {
    super(`You provided an invalid token secret`)
  }
}
