import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class UsernameUnavailableError extends InternalError {
  constructor(username: string) {
    super(`The username ${username} is not available`, {
      name: ErrorNames.UsernameUnavailable,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
