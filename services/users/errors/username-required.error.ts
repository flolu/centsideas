import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class UsernameRequiredError extends EntityError {
  static validate = (username: string): void => {
    if (!username) {
      throw new UsernameRequiredError();
    }
  };

  constructor() {
    super(`Username is required`, HttpStatusCodes.BadRequest);
  }
}
