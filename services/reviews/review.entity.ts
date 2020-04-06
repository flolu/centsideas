import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { IReviewScores, IReviewState } from '@cents-ideas/models';

import { commitFunctions, ReviewEvents } from './events';
import { ReviewDeletedEvent } from './events/review-deleted.event';

export class Review extends EventEntity<IReviewState> {
  static initialState: IReviewState = {
    id: '',
    ideaId: '',
    userId: '',
    content: '',
    scores: { control: 0, entry: 0, need: 0, time: 0, scale: 0 },
    createdAt: null,
    updatedAt: null,
    deleted: false,
    deletedAt: null,
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<IReviewState>) {
    super(commitFunctions, (snapshot && snapshot.state) || Review.initialState);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }

  static create(
    reviewId: string,
    ideaId: string,
    userId: string,
    content: string,
    scores: IReviewScores,
  ): Review {
    const review = new Review();
    review.pushEvents(
      new ReviewEvents.ReviewCreatedEvent(reviewId, ideaId, userId, content, scores),
    );
    return review;
  }

  update = (content?: string, scores?: IReviewScores) => {
    this.pushEvents(new ReviewEvents.ReviewUpdatedEvent(this.persistedState.id, content, scores));
    return this;
  };

  delete = () => {
    this.pushEvents(new ReviewDeletedEvent(this.persistedState.id));
    return this;
  };
}
