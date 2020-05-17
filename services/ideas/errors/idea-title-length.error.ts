import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class IdeaTitleLengthError extends InternalError {
  static readonly max: number = 100;
  static readonly min: number = 3;

  static validate = (title?: string): void => {
    if (title === undefined) return;
    if (title.length > IdeaTitleLengthError.max) throw new IdeaTitleLengthError(true, title.length);
    if (title.length < IdeaTitleLengthError.min)
      throw new IdeaTitleLengthError(false, title.length);
  };

  constructor(isToLong: boolean, actualLength: number) {
    const message = isToLong
      ? `Idea title should not be longer than ${IdeaTitleLengthError.max} characters.`
      : `Idea title should at least be ${IdeaTitleLengthError.min} characters long.`;

    super(`${message} You provided a title with a length of ${actualLength}`, {
      name: ErrorNames.IdeaTitleLength,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
