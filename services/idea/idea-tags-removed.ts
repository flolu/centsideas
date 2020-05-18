import {IdeaId} from '@centsideas/types';

import {IdeaTags} from './idea-tags';

export class IdeaTagsRemoved {
  static readonly eventName = 'idea.tags-removed';

  constructor(public readonly id: IdeaId, public readonly tags: IdeaTags) {}
}
