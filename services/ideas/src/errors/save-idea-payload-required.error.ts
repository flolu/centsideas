import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class SaveIdeaPayloadRequiredError extends IdeaError {
  static validate = (title?: string, description?: string): void => {
    if (!(title || description)) {
      throw new SaveIdeaPayloadRequiredError('Title or description is required to save an idea draft');
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.BadRequest);
  }
}
