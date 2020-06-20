import * as jwt from 'jsonwebtoken';

import {Exception} from '@centsideas/utils';
import {RpcStatus, GenericErrorNames} from '@centsideas/enums';

export abstract class Token<T> {
  static decode<T>(token: string, secret: string) {
    try {
      return (jwt.verify(token, secret) as any) as T;
    } catch (error) {
      throw new InvalidToken(token);
    }
  }

  sign(secret: string, expiresInSeconds: number) {
    return jwt.sign(Object(this.serializedPayload), secret, {expiresIn: expiresInSeconds});
  }

  protected abstract serializedPayload: T;
}

export class InvalidToken extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = GenericErrorNames.InvalidToken;

  constructor(invalidToken: string) {
    super(`You provided an invalid token: ${invalidToken}`);
  }
}
