import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class ReviewIdRequiredError extends InternalError {
  static validate = (reviewId: string): void => {
    if (!reviewId) throw new ReviewIdRequiredError();
  };

  constructor() {
    super(`Review id required`, {
      name: ErrorNames.ReviewIdRequired,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
