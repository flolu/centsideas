import { Event } from '@cents-ideas/event-sourcing';
import { IReviewPublishedEvent, IReviewState } from '@cents-ideas/models';
import { ReviewEvents } from '@cents-ideas/enums';

export class ReviewPublishedEvent extends Event<IReviewPublishedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewPublished;

  constructor(reviewId: string) {
    super(ReviewPublishedEvent.eventName, {}, reviewId);
  }

  static commit(state: IReviewState, _event: ReviewPublishedEvent): IReviewState {
    state.published = true;
    state.publishedAt = new Date().toISOString();
    return state;
  }
}
