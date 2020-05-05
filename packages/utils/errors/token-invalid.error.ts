import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';

import { InternalError } from './internal.error';

export class TokenInvalidError extends InternalError {
  constructor(invalidToken: string | null, extraInfo?: string) {
    const message = extraInfo
      ? `You provided an invalid token (${
          invalidToken ? invalidToken.slice(0, 10) : 'null'
        }...) ${extraInfo}`
      : `You provided an invalid token (${invalidToken ? invalidToken.slice(0, 10) : 'null'}...)`;

    super(message, {
      name: ErrorNames.TokenInvalid,
      code: grpc.status.UNAUTHENTICATED,
    });
  }
}
