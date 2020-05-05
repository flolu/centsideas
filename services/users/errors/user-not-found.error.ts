import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class UserNotFoundError extends InternalError {
  constructor(id: string) {
    super(`User with id: ${id} was not found`, {
      name: ErrorNames.UserNotFound,
      code: grpc.status.NOT_FOUND,
    });
  }
}
