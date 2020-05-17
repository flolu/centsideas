import {Event} from '@centsideas/event-sourcing';
import {ReviewEvents} from '@centsideas/enums';
import {IReviewState, IReviewUpdatedEvent} from '@centsideas/models';

export class ReviewUpdatedEvent extends Event<IReviewUpdatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewUpdated;

  constructor(reviewId: string, payload: IReviewUpdatedEvent) {
    super(ReviewUpdatedEvent.eventName, payload, reviewId);
  }

  static commit(state: IReviewState, event: ReviewUpdatedEvent): IReviewState {
    const {content, scores} = event.data;
    state.content = content || state.content;
    state.scores = scores || state.scores;
    state.updatedAt = event.timestamp;
    return state;
  }
}
