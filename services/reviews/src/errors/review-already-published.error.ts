import { HttpStatusCodes } from '@cents-ideas/enums';

import { ReviewError } from './review.error';

export class ReviewAlreadyPublishedError extends ReviewError {
  static validate = (published: boolean, reviewId: string): void => {
    if (published) {
      throw new ReviewAlreadyPublishedError(`Review with id: ${reviewId} has already been published`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
