import {IdeaId, UserId} from '@centsideas/types';

export class IdeaTitleRequired extends Error {
  constructor(idea: IdeaId, user: UserId) {
    super('Idea title is required');
  }
}
