import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class EmailInvalidError extends EntityError {
  static readonly regex = new RegExp(`^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`);

  static validate = (email: string): void => {
    if (EmailInvalidError.regex.test(email)) {
      throw new EmailInvalidError(`Invalid email address (${email})`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.BadRequest);
  }
}
