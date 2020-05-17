import {IEventEntityBase} from './event-base.model';

export interface IReviewState extends IEventEntityBase {
  ideaId: string;
  userId: string;
  content: string;
  scores: IReviewScores;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IReviewScores {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}
