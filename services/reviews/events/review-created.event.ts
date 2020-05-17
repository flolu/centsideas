import {Event} from '@centsideas/event-sourcing';
import {ReviewEvents} from '@centsideas/enums';
import {IReviewCreatedEvent, IReviewState} from '@centsideas/models';

export class ReviewCreatedEvent extends Event<IReviewCreatedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewCreated;

  constructor(payload: IReviewCreatedEvent) {
    super(ReviewCreatedEvent.eventName, payload, payload.reviewId);
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
