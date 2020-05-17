import {IReviewViewModel} from './review.view-model';
import {IReviewScores} from '../entities';
import {IEventEntityBase} from '../entities/event-base.model';

export interface IIdeaViewModel extends IEventEntityBase {
  title: string;
  userId: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  reviews: IReviewViewModel[];
  scores: IReviewScores;
  reviewCount: number;
}
