import {IdeaId} from '@centsideas/types';

import {IdeaTitle} from './idea-title';

export class IdeaRenamed {
  static readonly eventName = 'idea.renamed';

  constructor(public readonly id: IdeaId, public readonly title: IdeaTitle) {}
}
