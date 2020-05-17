import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class UsernameRequiredError extends InternalError {
  static validate = (username: string): void => {
    if (!username) throw new UsernameRequiredError();
  };

  constructor() {
    super(`Username is required`, {
      name: ErrorNames.UsernameRequired,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
