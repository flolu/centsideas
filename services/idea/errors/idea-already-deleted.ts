import {IdeaId, UserId} from '@centsideas/types';

export class IdeaAlreadyDeleted extends Error {
  constructor(idea: IdeaId, user: UserId) {
    super('Idea has already been deleted');
  }
}
