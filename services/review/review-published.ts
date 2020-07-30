import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {ReviewEventNames} from '@centsideas/enums';
import {Timestamp} from '@centsideas/types';
import {ReviewModels} from '@centsideas/models';

@DomainEvent(ReviewEventNames.Published)
export class ReviewPublished implements IDomainEvent {
  constructor(public readonly publishedAt: Timestamp) {}

  serialize(): ReviewModels.ReviewPublishedData {
    return {publishedAt: this.publishedAt.toString()};
  }

  static deserialze({publishedAt}: ReviewModels.ReviewPublishedData) {
    return new ReviewPublished(Timestamp.fromString(publishedAt));
  }
}
