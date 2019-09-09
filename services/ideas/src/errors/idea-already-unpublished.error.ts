import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaAlreadyUnpublishedError extends IdeaError {
  static validate = (published: boolean): void => {
    if (!published) {
      throw new IdeaAlreadyUnpublishedError('Idea already unpublished');
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
