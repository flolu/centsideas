import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewCreatedEvent } from '@cents-ideas/models';

import { IReviewState } from '../review.entity';

export class ReviewCreatedEvent extends Event<IReviewCreatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewCreated;

  constructor(reviewId: string, ideaId: string) {
    super(ReviewCreatedEvent.eventName, { reviewId, ideaId }, reviewId);
  }

  static commit(state: IReviewState, { aggregateId, data }: ReviewCreatedEvent): IReviewState {
    state.id = aggregateId;
    state.ideaId = data.ideaId;
    state.createdAt = new Date().toISOString();
    state.published = false;
    return state;
  }
}
