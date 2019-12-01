import { HttpStatusCodes } from '@cents-ideas/enums';

import { ReviewError } from './review.error';

export class ReviewAlreadyUnpublishedError extends ReviewError {
  static validate = (published: boolean, reviewId: string): void => {
    if (!published) {
      throw new ReviewAlreadyUnpublishedError(`Review with id: ${reviewId} has already been unpublished`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
