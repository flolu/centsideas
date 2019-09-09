import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

const max: number = 3000;
const min: number = 0;

export class IdeaDescriptionLengthError extends IdeaError {
  static validate = (description?: string): void => {
    if (!description) {
      return;
    }
    if (description.length > max) {
      throw new IdeaDescriptionLengthError(`Idea description should not be longer than ${max} characters`);
    }
    if (description.length < min) {
      throw new IdeaDescriptionLengthError(`Idea description should at least be ${min} characters long`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.BadRequest);
  }
}
