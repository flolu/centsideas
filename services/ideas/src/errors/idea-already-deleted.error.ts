import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaAlreadyDeletedError extends IdeaError {
  static validate = (deleted: boolean, ideaId: string): void => {
    if (deleted) {
      throw new IdeaAlreadyDeletedError(`Idea with id: ${ideaId} has already been deleted`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
