import {UserErrors, RpcStatus} from '../enums'
import {Exception} from './exception'

export enum UsernameLength {
  Max = 30,
  Min = 3,
}

export const usernameRegex = new RegExp('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$')

export class Username {
  private constructor(private readonly username: string) {
    if (!this.username || this.username.length < UsernameLength.Min)
      throw new UsernameTooShort(username)
    if (this.username.length > UsernameLength.Max) throw new UsernameTooLong(username)
    if (!usernameRegex.test(username)) throw new UsernameInvalid(username)
  }

  static fromString(username: string) {
    return new Username(username)
  }

  toString() {
    return this.username
  }

  equals(username: Username) {
    return this.username === username.toString()
  }
}

export class UsernameTooLong extends Exception {
  name = UserErrors.UsernameTooLong
  code = RpcStatus.INVALID_ARGUMENT

  constructor(username: string) {
    super(
      `Username too long. Max length is ${UsernameLength.Max}. ${username} is ${username.length} characters long.`,
      {username},
    )
  }
}

export class UsernameTooShort extends Exception {
  name = UserErrors.UsernameTooShort
  code = RpcStatus.INVALID_ARGUMENT

  constructor(username: string) {
    super(
      `Username too short. Min length is ${UsernameLength.Min}. ${username} is only ${
        username ? username.length : 0
      } characters long.`,
      {username},
    )
  }
}

export class UsernameInvalid extends Exception {
  name = UserErrors.UsernameInvalid
  code = RpcStatus.INVALID_ARGUMENT

  constructor(username: string) {
    super(
      `Username ${username} contains invalid characters. "_" and "." are allowed, when not used at start or end.`,
      {username},
    )
  }
}
