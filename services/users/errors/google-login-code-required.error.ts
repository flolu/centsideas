import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

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
