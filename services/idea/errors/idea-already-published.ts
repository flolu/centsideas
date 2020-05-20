import {IdeaId, UserId} from '@centsideas/types';

export class IdeaAlreadyPublished extends Error {
  constructor(idea: IdeaId, user: UserId) {
    super('Idea has already been published');
  }
}
