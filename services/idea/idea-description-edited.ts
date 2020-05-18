import {IdeaId} from '@centsideas/types';

import {IdeaDescription} from './idea-description';

export class IdeaDescriptionEdited {
  static readonly eventName = 'idea.description-edited';

  constructor(public readonly id: IdeaId, public readonly description: IdeaDescription) {}
}
