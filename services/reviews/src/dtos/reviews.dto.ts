import { IReviewScores } from '@cents-ideas/models';

export interface ICreateReviewDto {
  ideaId: string;
}

export interface ISaveReviewDto {
  content?: string;
  scores?: IReviewScores;
}

export interface IUpdateReviewDto {
  content: string;
  scores: IReviewScores;
}

export interface IQueryReviewDto {
  id: string;
}
