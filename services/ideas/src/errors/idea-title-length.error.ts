import { HttpStatusCodes } from '@cents-ideas/enums';

import { IdeaError } from './idea.error';

export class IdeaTitleLengthError extends IdeaError {
  static readonly max: number = 100;
  static readonly min: number = 3;

  static validate = (title?: string, onlyMaxLength: boolean = false): void => {
    // FIXME will this return if title is ''? !.... could cause issues
    if (!title) {
      return;
    }
    if (title.length > IdeaTitleLengthError.max) {
      throw new IdeaTitleLengthError(true, title.length);
    }
    if (onlyMaxLength && title.length < IdeaTitleLengthError.min) {
      throw new IdeaTitleLengthError(false, title.length);
    }
  };

  constructor(isToLong: boolean, actualLength: number) {
    const message = isToLong
      ? `Idea title should not be longer than ${IdeaTitleLengthError.max} characters.`
      : `Idea title should at least be ${IdeaTitleLengthError.min} characters long.`;
    super(`${message} You provided a title with a length of ${actualLength}`, HttpStatusCodes.BadRequest);
  }
}
