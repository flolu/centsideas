import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class GoogleLoginCodeRequiredError extends InternalError {
  static validate = (code: string): void => {
    if (!code) throw new GoogleLoginCodeRequiredError();
  };

  constructor() {
    super(`Google login code is required`, {
      name: ErrorNames.GoogleLoginCodeRequired,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
