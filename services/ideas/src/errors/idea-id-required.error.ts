import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

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
