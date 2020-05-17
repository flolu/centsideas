import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class UserNotFoundError extends InternalError {
  constructor(id: string) {
    super(`User with id: ${id} was not found`, {
      name: ErrorNames.UserNotFound,
      code: RpcStatus.NOT_FOUND,
    });
  }
}
