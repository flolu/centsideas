import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaAlreadyPublishedError extends EntityError {
  static validate = (published: boolean): void => {
    if (published) {
      throw new IdeaAlreadyPublishedError('Idea already published');
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
