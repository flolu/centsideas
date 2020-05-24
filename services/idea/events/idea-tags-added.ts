import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaTags} from '../idea-tags';

@DomainEvent(IdeaEventNames.TagsAdded)
export class IdeaTagsAdded implements IDomainEvent {
  constructor(public readonly id: IdeaId, public readonly tags: IdeaTags) {}

  serialize(): IdeaModels.IdeaTagsAddedData {
    return {id: this.id.toString(), tags: this.tags.toArray()};
  }

  static deserialize({id, tags}: IdeaModels.IdeaTagsAddedData) {
    return new IdeaTagsAdded(IdeaId.fromString(id), IdeaTags.fromArray(tags));
  }
}
