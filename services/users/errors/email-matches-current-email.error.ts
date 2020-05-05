import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class EmailMatchesCurrentEmailError extends InternalError {
  static validate = (currentEmail: string, newEmail: string): void => {
    if (currentEmail === newEmail) throw new EmailMatchesCurrentEmailError(currentEmail);
  };

  constructor(email: string) {
    super(`${email} is your current email`, {
      name: ErrorNames.EmailMatchesCurrentEmail,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
