import { HttpStatusCodes } from '@cents-ideas/enums';
import { EntityError } from '@cents-ideas/utils';

export class ReviewIdeaIdRequiredError extends EntityError {
  static validate = (ideaId: string): void => {
    if (!ideaId) {
      throw new ReviewIdeaIdRequiredError();
    }
  };

  constructor() {
    super(`Review id required`, HttpStatusCodes.BadRequest);
  }
}
