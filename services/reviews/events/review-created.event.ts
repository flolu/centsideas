import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewCreatedEvent, IReviewState } from '@cents-ideas/models';

export class ReviewCreatedEvent extends Event<IReviewCreatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewCreated;

  constructor(reviewId: string, ideaId: string, userId: string) {
    super(ReviewCreatedEvent.eventName, { reviewId, ideaId, userId }, reviewId);
  }

  static commit(state: IReviewState, event: ReviewCreatedEvent): IReviewState {
    state.id = event.aggregateId;
    state.ideaId = event.data.ideaId;
    state.userId = event.data.userId;
    state.createdAt = event.timestamp;
    state.published = false;
    return state;
  }
}
