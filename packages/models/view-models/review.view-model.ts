import { IReviewScores } from '../entities';

export interface IReviewViewModel {
  id: string;
  ideaId: string;
  userId: string;
  content: string;
  scores: IReviewScores;
  createdAt: string;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  draft: {
    content: string;
    scores: IReviewScores;
  } | null;
  lastEventId: string;
}
