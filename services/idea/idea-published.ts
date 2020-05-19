import {IdeaId, ISODate} from '@centsideas/types';
import {DomainEvent} from '@centsideas/event-sourcing2';

interface IdeaPublishedData {
  id: string;
  publishedAt: string;
}

export class IdeaPublished implements DomainEvent {
  static readonly eventName = 'idea.published';

  constructor(public readonly id: IdeaId, public readonly publishedAt: ISODate) {}

  serialize(): IdeaPublishedData {
    return {
      id: this.id.toString(),
      publishedAt: this.publishedAt.toString(),
    };
  }

  static deserialize({id, publishedAt}: IdeaPublishedData) {
    return new IdeaPublished(IdeaId.fromString(id), ISODate.fromString(publishedAt));
  }
}
