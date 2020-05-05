import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';

import { InternalError } from './internal.error';

export class PermissionDeniedError extends InternalError {
  static validate = (auid: string | null, eligibleUserId: string): void => {
    if (!auid) throw new PermissionDeniedError();
    if (auid !== eligibleUserId) throw new PermissionDeniedError();
  };

  constructor() {
    super(`No permission`, { name: ErrorNames.NoPermission, code: grpc.status.PERMISSION_DENIED });
  }
}
