import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class AlreadyCreatedReviewError extends InternalError {
  constructor() {
    super(`You have already created a review for this idea`, {
      name: ErrorNames.AlreadyCreatedReview,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
