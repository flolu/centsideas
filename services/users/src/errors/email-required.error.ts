import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

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
