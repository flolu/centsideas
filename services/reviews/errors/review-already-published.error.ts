import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class ReviewAlreadyPublishedError extends EntityError {
  static validate = (published: boolean, reviewId: string): void => {
    if (published) {
      throw new ReviewAlreadyPublishedError(
        `Review with id: ${reviewId} has already been published`,
      );
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
