import {UsernameLength, UsernameRegex} from '@centsideas/enums';

import * as Errors from './user.errors';

export class Username {
  private constructor(private readonly username: string) {
    if (!this.username || this.username.length < UsernameLength.Min)
      throw new Errors.UsernameTooShort(username);
    if (this.username.length > UsernameLength.Max) throw new Errors.UsernameTooLong(username);
    if (!UsernameRegex.test(username)) throw new Errors.UsernameInvalid(username);
  }

  static fromString(username: string) {
    return new Username(username);
  }

  toString() {
    return this.username;
  }
}
