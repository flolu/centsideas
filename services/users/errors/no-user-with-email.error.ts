import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class NoUserWithEmailError extends InternalError {
  constructor(email: string) {
    super(`We couldn't find a user with the email: ${email}`, {
      name: ErrorNames.NoUserWithEmail,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
