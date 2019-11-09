import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';

import { commitFunctions } from './events';
import { ReviewNotFoundError } from './errors';

interface IReviewScores {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}
export interface IReviewState {
  id: string;
  content: string;
  scores: IReviewScores;
  createdAt: string | null;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  draft: { content: string; scores: IReviewScores } | null;
}

export class Review extends EventEntity<IReviewState> {
  static initialState: IReviewState = {
    id: '',
    content: '',
    scores: {
      control: 0,
      entry: 0,
      need: 0,
      time: 0,
      scale: 0,
    },
    createdAt: null,
    published: false,
    publishedAt: null,
    unpublishedAt: null,
    updatedAt: null,
    draft: null,
  };

  constructor(snapshot?: ISnapshot<IReviewState>) {
    super(commitFunctions, (snapshot && snapshot.state) || Review.initialState, ReviewNotFoundError);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }
}
