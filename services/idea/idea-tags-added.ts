import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId} from '@centsideas/types';

import {IdeaTags} from './idea-tags';

interface IdeaTagsAddedData {
  id: string;
  tags: string[];
}

export class IdeaTagsAdded implements DomainEvent {
  static readonly eventName = 'idea.tags-added';

  constructor(public readonly id: IdeaId, public readonly tags: IdeaTags) {}

  serialize(): IdeaTagsAddedData {
    return {id: this.id.toString(), tags: this.tags.toArray()};
  }

  static deserialize({id, tags}: IdeaTagsAddedData) {
    return new IdeaTagsAdded(IdeaId.fromString(id), IdeaTags.fromArray(tags));
  }
}
