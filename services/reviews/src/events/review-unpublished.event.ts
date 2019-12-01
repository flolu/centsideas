import { Event } from '@cents-ideas/event-sourcing';
import { IReviewPublishedEvent, IReviewState } from '@cents-ideas/models';
import { ReviewEvents } from '@cents-ideas/enums';

export class ReviewUnpublishedEvent extends Event<IReviewPublishedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewUnpublished;

  constructor(reviewId: string) {
    super(ReviewUnpublishedEvent.eventName, {}, reviewId);
  }

  static commit(state: IReviewState, _event: ReviewUnpublishedEvent): IReviewState {
    state.published = false;
    state.unpublishedAt = new Date().toISOString();
    return state;
  }
}
