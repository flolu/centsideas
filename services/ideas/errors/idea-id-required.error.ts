import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class IdeaIdRequiredError extends InternalError {
  static validate = (ideaId: string): void => {
    if (!ideaId) throw new IdeaIdRequiredError();
  };

  constructor() {
    super(`Idea id required`, {
      name: ErrorNames.IdeaIdRequired,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
