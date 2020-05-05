import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class ReviewNotFoundError extends InternalError {
  constructor(id: string) {
    super(`Review with id: ${id} was not found`, {
      name: ErrorNames.ReviewNotFound,
      code: grpc.status.NOT_FOUND,
    });
  }
}
