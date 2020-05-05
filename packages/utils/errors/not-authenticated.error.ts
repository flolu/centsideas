import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';

import { InternalError } from './internal.error';

export class UnauthenticatedError extends InternalError {
  static validate = (userId: string | null): void => {
    if (!userId) throw new UnauthenticatedError();
  };

  constructor() {
    super(`Not authenticated. Please login.`, {
      code: grpc.status.UNAUTHENTICATED,
      name: ErrorNames.Unauthenticated,
    });
  }
}
