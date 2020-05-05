import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class ReviewContentLengthError extends InternalError {
  static readonly max: number = 3000;
  static readonly min: number = 10;

  static validate = (content: string, onlyMaxLength: boolean = false): void => {
    if (content.length > ReviewContentLengthError.max)
      throw new ReviewContentLengthError(true, content.length);
    if (onlyMaxLength && content.length < ReviewContentLengthError.min)
      throw new ReviewContentLengthError(false, content.length);
  };

  constructor(isToLong: boolean, actualLength: number) {
    const message = isToLong
      ? `Review content should not be longer than ${ReviewContentLengthError.max} characters.`
      : `Review content should at least be ${ReviewContentLengthError.min} characters long.`;
    super(`${message} You provided a content with a length of ${actualLength}`, {
      name: ErrorNames.ReviewContentLength,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
