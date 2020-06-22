import {Exception} from '@centsideas/utils';
import {RpcStatus, UserErrorNames} from '@centsideas/enums';
import {UserId, Email} from '@centsideas/types';

export class UserNotFound extends Exception {
  code = RpcStatus.NOT_FOUND;
  name = UserErrorNames.NotFound;

  constructor(id?: UserId) {
    super(`User with id ${id ? id.toString() : '<not specified>'} wasn't found`);
  }
}

export class UserWithEmailNotFound extends Exception {
  code = RpcStatus.NOT_FOUND;
  name = UserErrorNames.NotFound;

  constructor(email: Email) {
    super(`User with email ${email.toString()} wasn't found`);
  }
}
