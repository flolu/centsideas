import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class EmailNotAvailableError extends InternalError {
  constructor(email: string) {
    super(`${email} is not available`, {
      name: ErrorNames.EmailNotAvailable,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
