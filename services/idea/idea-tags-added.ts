import {IdeaId} from '@centsideas/types';

import {IdeaTags} from './idea-tags';

export class IdeaTagsAdded {
  static readonly eventName = 'idea.tags-added';

  constructor(public readonly id: IdeaId, public readonly tags: IdeaTags) {}
}
