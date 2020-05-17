import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class LoginNotFoundError extends InternalError {
  constructor(id: string) {
    super(`Login with id: ${id} was not found`, {
      name: ErrorNames.LoginNotFound,
      code: RpcStatus.NOT_FOUND,
    });
  }
}
