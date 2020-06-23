import {UsernameLength, UsernameRegex, RpcStatus, UserErrorNames} from '@centsideas/enums';
import {Exception} from '@centsideas/utils';

export class Username {
  private constructor(private readonly username: string) {
    if (!this.username || this.username.length < UsernameLength.Min)
      throw new UsernameTooShort(username);
    if (this.username.length > UsernameLength.Max) throw new UsernameTooLong(username);
    if (!UsernameRegex.test(username)) throw new UsernameInvalid(username);
  }

  static fromString(username: string) {
    return new Username(username);
  }

  toString() {
    return this.username;
  }

  equals(username: Username) {
    return this.username === username.toString();
  }
}

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
      `Username too short. Min length is ${UsernameLength.Min}. ${username} is only ${
        username ? username.length : 0
      } characters long.`,
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
