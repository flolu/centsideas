import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class UserIdRequiredError extends EntityError {
  static validate = (userId: string): void => {
    if (!userId) {
      throw new UserIdRequiredError();
    }
  };

  constructor() {
    super(`User id required`, HttpStatusCodes.BadRequest);
  }
}
