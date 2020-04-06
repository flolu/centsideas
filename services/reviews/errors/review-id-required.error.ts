import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

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
