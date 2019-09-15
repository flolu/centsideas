import { IdeaError } from './idea.error';
import { HttpStatusCodes } from '@cents-ideas/enums';

const max: number = 100;
const min: number = 3;

export class IdeaTitleLengthError extends IdeaError {
  static validate = (title?: string, onlyMaxLength: boolean = false): void => {
    if (!title) {
      return;
    }
    if (title.length > max) {
      throw new IdeaTitleLengthError(`Idea title should not be longer than ${max} characters`);
    }
    if (onlyMaxLength && title.length < min) {
      throw new IdeaTitleLengthError(`Idea title should at least be ${min} characters long`);
    }
  };

  constructor(message: string) {
    super(message, HttpStatusCodes.BadRequest);
  }
}
