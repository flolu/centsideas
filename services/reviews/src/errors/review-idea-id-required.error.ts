import { HttpStatusCodes } from '@cents-ideas/enums';
import { ReviewError } from './review.error';

export class ReviewIdeaIdRequiredError extends ReviewError {
  static validate = (ideaId: string): void => {
    if (!ideaId) {
      throw new ReviewIdeaIdRequiredError();
    }
  };

  constructor() {
    super(`Idea id required`, HttpStatusCodes.BadRequest);
  }
}
