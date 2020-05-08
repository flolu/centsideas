import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class ReviewIdRequiredError extends InternalError {
  static validate = (reviewId: string): void => {
    if (!reviewId) throw new ReviewIdRequiredError();
  };

  constructor() {
    super(`Review id required`, {
      name: ErrorNames.ReviewIdRequired,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
