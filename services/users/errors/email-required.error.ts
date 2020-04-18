import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class EmailRequiredError extends EntityError {
  static validate = (email: string): void => {
    if (!email) {
      throw new EmailRequiredError();
    }
  };

  constructor() {
    super(`Email is required`, HttpStatusCodes.BadRequest);
  }
}
