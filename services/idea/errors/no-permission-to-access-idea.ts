import {IdeaId, UserId} from '@centsideas/types';

export class NoPermissionToAccessIdea extends Error {
  constructor(idea: IdeaId, user: UserId) {
    super();
  }
}
