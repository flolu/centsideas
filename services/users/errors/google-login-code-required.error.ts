import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class GoogleLoginCodeRequiredError extends EntityError {
  static validate = (code: string): void => {
    if (!code) {
      throw new GoogleLoginCodeRequiredError();
    }
  };

  constructor() {
    super(`Google login code is required`, HttpStatusCodes.BadRequest);
  }
}
