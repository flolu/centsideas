import { HttpStatusCodes } from '@cents-ideas/enums';

import { EntityError } from '..';

export class NotAuthenticatedError extends EntityError {
  static validate = (userId: string | null): void => {
    if (!userId) {
      throw new NotAuthenticatedError();
    }
  };

  constructor() {
    super(`Not authenticated. Please login.`, HttpStatusCodes.BadRequest);
  }
}
