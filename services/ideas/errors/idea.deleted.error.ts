import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaDeletedError extends EntityError {
  static validate = (ideaId: string, deleted: boolean): void => {
    if (deleted) {
      throw new IdeaDeletedError(ideaId);
    }
  };

  constructor(id: string) {
    super(`Idea with id: ${id} has been deleted`, HttpStatusCodes.NotFound);
  }
}
