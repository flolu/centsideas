import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class UsernameRequiredError extends InternalError {
  static validate = (username: string): void => {
    if (!username) throw new UsernameRequiredError();
  };

  constructor() {
    super(`Username is required`, {
      name: ErrorNames.UsernameRequired,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
