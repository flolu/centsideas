import { IReviewViewModel } from './review.view-model';
import { IReviewScores } from '../entities';

export interface IIdeaViewModel {
  id: string;
  title: string;
  userId: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  reviews: IReviewViewModel[];
  scores: IReviewScores;
  lastEventId: string;
  reviewCount: number;
}
