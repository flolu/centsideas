import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaAlreadyDeletedError extends EntityError {
  static validate = (deleted: boolean, ideaId: string): void => {
    if (deleted) {
      throw new IdeaAlreadyDeletedError(`Idea with id: ${ideaId} has already been deleted`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
