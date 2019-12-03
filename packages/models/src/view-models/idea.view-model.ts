import { IReviewViewModel } from './review.view-model';
import { IReviewScores } from '../entities';

export interface IIdeaViewModel {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  draft: null | { title: string; description: string };
  reviews: IReviewViewModel[];
  scores: IReviewScores;
  user: any;
  // TODO frontend receives lastEvent: { ... } in frontend, but should be lastEventId: "..."
  lastEventId: string;
}
