import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewScores, IReviewState, IReviewUpdatedEvent } from '@cents-ideas/models';

export class ReviewUpdatedEvent extends Event<IReviewUpdatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewUpdated;

  constructor(reviewId: string, content?: string, scores?: IReviewScores) {
    super(ReviewUpdatedEvent.eventName, { content, scores }, reviewId);
  }

  static commit(state: IReviewState, { data }: ReviewUpdatedEvent): IReviewState {
    const { content, scores } = data;
    state.content = content || state.content;
    state.scores = scores || state.scores;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
