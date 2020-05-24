import {IdeaId, ISODate} from '@centsideas/types';
import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

@DomainEvent(IdeaEventNames.Published)
export class IdeaPublished implements IDomainEvent {
  constructor(public readonly id: IdeaId, public readonly publishedAt: ISODate) {}

  serialize(): IdeaModels.IdeaPublishedData {
    return {
      id: this.id.toString(),
      publishedAt: this.publishedAt.toString(),
    };
  }

  static deserialize({id, publishedAt}: IdeaModels.IdeaPublishedData) {
    return new IdeaPublished(IdeaId.fromString(id), ISODate.fromString(publishedAt));
  }
}
