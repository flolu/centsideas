import { EventEntity, ISnapshot, initialEntityBaseState } from '@centsideas/event-sourcing';
import { IReviewState, IReviewCreatedEvent, IReviewUpdatedEvent } from '@centsideas/models';

import { commitFunctions, ReviewEvents } from './events';
import { ReviewDeletedEvent } from './events/review-deleted.event';

export class Review extends EventEntity<IReviewState> {
  static initialState: IReviewState = {
    ...initialEntityBaseState,
    ideaId: '',
    userId: '',
    content: '',
    scores: { control: 0, entry: 0, need: 0, time: 0, scale: 0 },
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    deleted: false,
  };

  constructor(snapshot?: ISnapshot<IReviewState>) {
    if (snapshot && snapshot.state) {
      super(commitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(commitFunctions, Review.initialState);
  }

  static create(payload: IReviewCreatedEvent): Review {
    const review = new Review();
    review.pushEvents(new ReviewEvents.ReviewCreatedEvent(payload));
    return review;
  }

  update(payload: IReviewUpdatedEvent) {
    this.pushEvents(new ReviewEvents.ReviewUpdatedEvent(this.currentState.id, payload));
    return this;
  }

  delete() {
    this.pushEvents(new ReviewDeletedEvent(this.currentState.id));
    return this;
  }
}
