import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class ReviewIdRequiredError extends EntityError {
  static validate = (reviewId: string): void => {
    if (!reviewId) {
      throw new ReviewIdRequiredError();
    }
  };

  constructor() {
    super(`Review id required`, HttpStatusCodes.BadRequest);
  }
}
