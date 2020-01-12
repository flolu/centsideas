import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

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
