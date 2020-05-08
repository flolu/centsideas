import { ErrorNames, RpcStatus } from '@centsideas/enums';

import { InternalError } from './internal.error';

export class PermissionDeniedError extends InternalError {
  static validate = (auid: string | null, eligibleUserId: string): void => {
    if (!auid) throw new PermissionDeniedError();
    if (auid !== eligibleUserId) throw new PermissionDeniedError();
  };

  constructor() {
    super(`No permission`, { name: ErrorNames.NoPermission, code: RpcStatus.PERMISSION_DENIED });
  }
}
