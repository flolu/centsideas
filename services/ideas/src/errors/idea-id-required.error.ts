import { HttpStatusCodes } from '@cents-ideas/enums';
import { IdeaError } from './idea.error';

export class IdeaIdRequiredError extends IdeaError {
  static validate = (ideaId: string): void => {
    if (!ideaId) {
      throw new IdeaIdRequiredError();
    }
  };

  constructor() {
    super(`Idea id required`, HttpStatusCodes.BadRequest);
  }
}
