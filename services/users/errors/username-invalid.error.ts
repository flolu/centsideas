import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class UsernameInvalidError extends EntityError {
  static readonly max: number = 30;
  static readonly min: number = 3;
  static readonly regex = new RegExp('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');

  static validate = (username: string): void => {
    if (username.length < UsernameInvalidError.min) {
      throw new UsernameInvalidError(
        `Username should be at least ${UsernameInvalidError.min} characters long (${username} is only ${username.length} characters long)`,
      );
    }

    if (username.length > UsernameInvalidError.max) {
      throw new UsernameInvalidError(
        `Username should not be longer than ${UsernameInvalidError.max} characters (${username} is ${username.length} characters long)`,
      );
    }

    if (!UsernameInvalidError.regex.test(username)) {
      throw new UsernameInvalidError(
        `Invalid username. Make sure you are not using any special characters. "_" and "." are allowed when not used as first or last character.`,
      );
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.BadRequest);
  }
}
