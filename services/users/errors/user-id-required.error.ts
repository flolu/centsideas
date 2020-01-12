import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

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
