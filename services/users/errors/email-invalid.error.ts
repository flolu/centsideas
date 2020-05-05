import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class EmailInvalidError extends InternalError {
  static readonly regex = new RegExp(`^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`);

  static validate = (email: string): void => {
    if (EmailInvalidError.regex.test(email))
      throw new EmailInvalidError(`Invalid email address (${email})`);
  };

  constructor(message: string) {
    super(message, {
      name: ErrorNames.EmailInvalid,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
