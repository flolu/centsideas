import {IdeaId, UserId} from '@centsideas/types';

export class IdeaTitleRequiredError extends Error {
  constructor(idea: IdeaId, user: UserId) {
    super();
  }
}
