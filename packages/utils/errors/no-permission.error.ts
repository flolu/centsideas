import { HttpStatusCodes } from '@centsideas/enums';

import { EntityError } from '..';

export class NoPermissionError extends EntityError {
  static validate = (auid: string | null, eligibleUserId: string): void => {
    if (!auid) {
      throw new NoPermissionError();
    }
    if (auid !== eligibleUserId) {
      throw new NoPermissionError();
    }
  };

  constructor() {
    super(`No permission`, HttpStatusCodes.BadRequest);
  }
}
