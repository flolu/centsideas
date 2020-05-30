import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaTags} from './idea-tags';

@DomainEvent(IdeaEventNames.TagsAdded)
export class IdeaTagsAdded implements IDomainEvent {
  constructor(public readonly tags: IdeaTags) {}

  serialize(): IdeaModels.IdeaTagsAddedData {
    return {tags: this.tags.toArray()};
  }

  static deserialize({tags}: IdeaModels.IdeaTagsAddedData) {
    return new IdeaTagsAdded(IdeaTags.fromArray(tags));
  }
}
