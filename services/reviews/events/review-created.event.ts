import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewCreatedEvent, IReviewState, IReviewScores } from '@cents-ideas/models';

export class ReviewCreatedEvent extends Event<IReviewCreatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewCreated;

  constructor(
    reviewId: string,
    ideaId: string,
    userId: string,
    content: string,
    scores: IReviewScores,
  ) {
    super(ReviewCreatedEvent.eventName, { reviewId, ideaId, userId, content, scores }, reviewId);
  }

  static commit(state: IReviewState, event: ReviewCreatedEvent): IReviewState {
    state.id = event.aggregateId;
    state.ideaId = event.data.ideaId;
    state.userId = event.data.userId;
    state.createdAt = event.timestamp;
    state.content = event.data.content;
    state.scores = event.data.scores;
    return state;
  }
}
