import {Exception} from '@centsideas/utils';
import {RpcStatus, UserErrorNames} from '@centsideas/enums';
import {UserId} from '@centsideas/types';

export class UserNotFound extends Exception {
  code = RpcStatus.NOT_FOUND;
  name = UserErrorNames.NotFound;

  constructor(id: UserId) {
    super(`User with id ${id.toString()} wasn't found`);
  }
}
