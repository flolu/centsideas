import { HttpStatusCodes } from '@cents-ideas/enums';

import { EntityError } from '..';

export class NotAuthenticatedError extends EntityError {
  static validate = (authenticated: boolean): void => {
    if (!authenticated) {
      throw new NotAuthenticatedError();
    }
  };

  constructor() {
    super(`Not authenticated. Please login.`, HttpStatusCodes.BadRequest);
  }
}
