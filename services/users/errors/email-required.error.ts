import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class EmailRequiredError extends InternalError {
  static validate = (email: string): void => {
    if (!email) throw new EmailRequiredError();
  };

  constructor() {
    super(`Email is required`, {
      name: ErrorNames.EmailRequired,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
