import { HttpStatusCodes } from '@cents-ideas/enums';

import { EntityError } from '..';

export class NoPermissionError extends EntityError {
  static validate = (authenticatedUserId: string | null, eligibleUserId: string): void => {
    if (!authenticatedUserId) {
      throw new NoPermissionError();
    }
    if (authenticatedUserId !== eligibleUserId) {
      throw new NoPermissionError();
    }
  };

  constructor() {
    super(`No permission`, HttpStatusCodes.BadRequest);
  }
}
