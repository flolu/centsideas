import { Event } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewDraftSavedEvent, IReviewScores, IReviewState } from '@cents-ideas/models';

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
