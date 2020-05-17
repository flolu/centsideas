import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class IdeaDescriptionLengthError extends InternalError {
  static max: number = 3000;
  static min: number = 0;

  static validate = (description?: string, onlyMaxLength: boolean = false): void => {
    if (!description) return;
    if (description.length > IdeaDescriptionLengthError.max)
      throw new IdeaDescriptionLengthError(true, description.length);
    if (onlyMaxLength && description.length < IdeaDescriptionLengthError.min)
      throw new IdeaDescriptionLengthError(false, description.length);
  };

  constructor(isToLong: boolean, actualLength: number) {
    const message = isToLong
      ? `Idea description should not be longer than ${IdeaDescriptionLengthError.max} characters.`
      : `Idea description should at least be ${IdeaDescriptionLengthError.min} characters long.`;

    super(`${message} You provided a description with a length of ${actualLength}`, {
      name: ErrorNames.IdeaDescriptionLength,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
