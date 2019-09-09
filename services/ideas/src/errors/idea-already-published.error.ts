import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaAlreadyPublishedError extends IdeaError {
  static validate = (published: boolean): void => {
    if (published) {
      throw new IdeaAlreadyPublishedError('Idea already published');
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
