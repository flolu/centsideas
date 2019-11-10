import { Event } from '@cents-ideas/event-sourcing';
import { IReviewPublishedEvent } from '@cents-ideas/models';
import { ReviewEvents } from '@cents-ideas/enums';

export class ReviewPublishedEvent extends Event<IReviewPublishedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewPublished;
}
