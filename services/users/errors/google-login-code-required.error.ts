import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class GoogleLoginCodeRequiredError extends InternalError {
  static validate = (code: string): void => {
    if (!code) throw new GoogleLoginCodeRequiredError();
  };

  constructor() {
    super(`Google login code is required`, {
      name: ErrorNames.GoogleLoginCodeRequired,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
