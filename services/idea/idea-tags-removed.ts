import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaTags} from './idea-tags';

@DomainEvent(IdeaEventNames.TagsRemoved)
export class IdeaTagsRemoved implements IDomainEvent {
  constructor(public readonly tags: IdeaTags) {}

  serialize(): IdeaModels.IdeaTagsRemovedData {
    return {
      tags: this.tags.toArray(),
    };
  }

  static deserialize({tags}: IdeaModels.IdeaTagsRemovedData) {
    return new IdeaTagsRemoved(IdeaTags.fromArray(tags));
  }
}
