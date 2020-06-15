import {Exception} from '@centsideas/utils';
import {RpcStatus, UserErrorNames, UsernameLength} from '@centsideas/enums';
import {UserId} from '@centsideas/types';

export class UsernameTooLong extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = UserErrorNames.UsernameTooLong;

  constructor(username: string) {
    super(
      `Username too long. Max length is ${UsernameLength.Max}. ${username} is ${username.length} characters long.`,
      {username},
    );
  }
}

export class UsernameTooShort extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = UserErrorNames.UsernameTooShort;

  constructor(username: string) {
    super(
      `Username too short. Min length is ${UsernameLength.Min}. ${username} is only ${username.length} characters long.`,
      {username},
    );
  }
}

export class UsernameInvalid extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = UserErrorNames.UsernameInvalid;

  constructor(username: string) {
    super(
      `Username ${username} contains invalid characters. "_" and "." are allowed, when not used at start or end.`,
      {username},
    );
  }
}

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
