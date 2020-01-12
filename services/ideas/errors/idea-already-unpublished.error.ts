import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaAlreadyUnpublishedError extends EntityError {
  static validate = (published: boolean): void => {
    if (!published) {
      throw new IdeaAlreadyUnpublishedError('Idea already unpublished');
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.Conflict);
  }
}
