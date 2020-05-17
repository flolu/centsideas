import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';

export class IdeaAlreadyDeletedError extends InternalError {
  static validate = (deleted: boolean, ideaId: string): void => {
    if (deleted) throw new IdeaAlreadyDeletedError(ideaId);
  };

  constructor(ideaId: string) {
    super(`Idea with id: ${ideaId} has already been deleted`, {
      name: ErrorNames.IdeaAlreadyDeleted,
      code: RpcStatus.FAILED_PRECONDITION,
    });
  }
}
