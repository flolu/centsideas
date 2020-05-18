import {IdeaId} from '@centsideas/types';

export class IdeaDeleted {
  static readonly eventName = 'idea.deleted';

  constructor(public readonly id: IdeaId) {}
}
