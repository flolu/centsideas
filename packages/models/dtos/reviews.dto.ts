import {IReviewScores} from '../';

export interface ICreateReviewDto {
  ideaId: string;
  content: string;
  scores: IReviewScores;
}

export interface IUpdateReviewDto {
  content: string;
  scores: IReviewScores;
}
