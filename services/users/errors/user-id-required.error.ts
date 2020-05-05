import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class UserIdRequiredError extends InternalError {
  static validate = (userId: string): void => {
    if (!userId) throw new UserIdRequiredError();
  };

  constructor() {
    super(`User id required`, {
      name: ErrorNames.UserIdRequired,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
