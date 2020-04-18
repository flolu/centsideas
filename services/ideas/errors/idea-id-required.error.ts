import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

export class IdeaIdRequiredError extends EntityError {
  static validate = (ideaId: string): void => {
    if (!ideaId) {
      throw new IdeaIdRequiredError();
    }
  };

  constructor() {
    super(`Idea id required`, HttpStatusCodes.BadRequest);
  }
}
