import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class ReviewAlreadyUnpublishedError extends EntityError {
  static validate = (published: boolean, reviewId: string): void => {
    if (!published) {
      throw new ReviewAlreadyUnpublishedError(`Review with id: ${reviewId} has already been unpublished`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
