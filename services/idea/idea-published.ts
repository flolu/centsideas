import {IdeaId} from '@centsideas/types';

export class IdeaPublished {
  static readonly eventName = 'idea.published';

  constructor(public readonly id: IdeaId) {}
}
