import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewCreatedEvent } from '@cents-ideas/models';

import { IReviewState } from '../review.entity';

export class ReviewCreatedEvent extends Event<IReviewCreatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewCreated;

  constructor(reviewId: string) {
    super(ReviewCreatedEvent.eventName, { reviewId }, reviewId);
  }

  static commit(state: IReviewState, event: ReviewCreatedEvent): IReviewState {
    state.id = event.aggregateId;
    state.createdAt = new Date().toISOString();
    state.published = false;
    return state;
  }
}
