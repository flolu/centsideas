import {Exception} from '@centsideas/utils';
import {RpcStatus, UserErrorNames} from '@centsideas/enums';
import {UserId, Username} from '@centsideas/types';

export class NoPermissionToAccessUser extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = UserErrorNames.NoPermission;

  constructor(user: UserId, requester: UserId) {
    super(`No permission to access user with id: ${user.toString()}`, {
      userId: user.toString(),
      requesterId: requester.toString(),
    });
  }
}

export class UserAlreadyDeleted extends Exception {
  name = UserErrorNames.AlreadyDeleted;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(user: UserId, requester: UserId) {
    super('Idea has already been deleted', {
      userId: user.toString(),
      requesterId: requester.toString(),
    });
  }
}

export class UserDeletionMustBeRequested extends Exception {
  name = UserErrorNames.UserDeletionMustBeRequested;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(user: UserId) {
    super('You have to request your account deletion before confirming it!', {
      userId: user.toString(),
    });
  }
}

export class UserNotFound extends Exception {
  name = UserErrorNames.NotFound;
  code = RpcStatus.NOT_FOUND;

  constructor(id: UserId) {
    super(`User with id ${id.toString()} was not found`);
  }
}

export class UsernameUnavailable extends Exception {
  name = UserErrorNames.UsernameUnavailable;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(username: Username) {
    super(`Username ${username.toString()} is not available`);
  }
}

export class UsernameNotChanged extends Exception {
  name = UserErrorNames.UsernameNotChanged;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(username: Username) {
    super(`Your username already id ${username.toString()}`);
  }
}
