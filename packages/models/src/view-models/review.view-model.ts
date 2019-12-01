import { IReviewScores } from '../entities';

export interface IReviewViewModel {
  id: string;
  ideaId: string;
  content: string;
  scores: IReviewScores;
  createdAt: string;
  published: boolean;
  publishedAt: string;
  unpublishedAt: string;
  updatedAt: string;
  draft: {
    content: string;
    scores: IReviewScores;
  } | null;
}
