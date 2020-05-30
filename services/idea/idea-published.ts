import {ISODate} from '@centsideas/types';
import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

@DomainEvent(IdeaEventNames.Published)
export class IdeaPublished implements IDomainEvent {
  constructor(public readonly publishedAt: ISODate) {}

  serialize(): IdeaModels.IdeaPublishedData {
    return {
      publishedAt: this.publishedAt.toString(),
    };
  }

  static deserialize({publishedAt}: IdeaModels.IdeaPublishedData) {
    return new IdeaPublished(ISODate.fromString(publishedAt));
  }
}
