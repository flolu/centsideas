import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class IdeaNotFoundError extends InternalError {
  constructor(id: string) {
    super(`Idea with id: ${id} was not found`, {
      name: ErrorNames.IdeaNotFound,
      code: grpc.status.NOT_FOUND,
    });
  }
}
