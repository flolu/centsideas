import {Event} from '@centsideas/event-sourcing';
import {IReviewDeletedEvent, IReviewState} from '@centsideas/models';
import {ReviewEvents} from '@centsideas/enums';

export class ReviewDeletedEvent extends Event<IReviewDeletedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewUnpublished;

  constructor(reviewId: string) {
    super(ReviewDeletedEvent.eventName, {}, reviewId);
  }

  static commit(state: IReviewState, event: ReviewDeletedEvent): IReviewState {
    state.deleted = true;
    state.deletedAt = event.timestamp;
    return state;
  }
}
