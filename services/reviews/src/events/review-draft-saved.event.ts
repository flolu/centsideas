import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewDraftSavedEvent, IReviewScores } from '@cents-ideas/models';

import { IReviewState } from '../review.entity';

export class ReviewDraftSavedEvent extends Event<IReviewDraftSavedEvent> {
  static readonly eventName: string = ReviewEvents.ReviewDraftSaved;

  constructor(reviewId: string, content?: string, scores?: IReviewScores) {
    super(ReviewDraftSavedEvent.eventName, { content, scores }, reviewId);
  }

  static commit(state: IReviewState, { data }: ReviewDraftSavedEvent): IReviewState {
    const { content, scores } = data;
    state.draft = {
      ...state.draft,
      content: content || (state.draft && state.draft.content) || '',
      scores: scores || state.scores,
    };
    return state;
  }
}
