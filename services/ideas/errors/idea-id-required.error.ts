import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class IdeaIdRequiredError extends InternalError {
  static validate = (ideaId: string): void => {
    if (!ideaId) throw new IdeaIdRequiredError();
  };

  constructor() {
    super(`Idea id required`, {
      name: ErrorNames.IdeaIdRequired,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
