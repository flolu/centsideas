import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaTagsAddedData} from '@centsideas/models';

import {IdeaTags} from '../idea-tags';

export class IdeaTagsAdded implements DomainEvent {
  readonly eventName = IdeaEventNames.TagsAdded;

  constructor(public readonly id: IdeaId, public readonly tags: IdeaTags) {}

  serialize(): IdeaTagsAddedData {
    return {id: this.id.toString(), tags: this.tags.toArray()};
  }

  static deserialize({id, tags}: IdeaTagsAddedData) {
    return new IdeaTagsAdded(IdeaId.fromString(id), IdeaTags.fromArray(tags));
  }
}
