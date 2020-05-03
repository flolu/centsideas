import { IReviewState, IReviewScores } from '@centsideas/models';

interface ICreateReviewCommand {
  ideaId: string;
  content: string;
  scores: IReviewScores;
  userId: string;
}

interface IUpdateReviewCommand {
  reviewId: string;
  content: string;
  scores: IReviewScores;
  userId: string;
}

interface IDeleteReviewCommand {
  reviewId: string;
  userId: string;
}

export type CreateReview = (payload: ICreateReviewCommand) => Promise<IReviewState>;
export type UpdateReview = (payload: IUpdateReviewCommand) => Promise<IReviewState>;
export type DeleteReview = (payload: IDeleteReviewCommand) => Promise<IReviewState>;

export interface IReviewCommands {
  create: CreateReview;
  update: UpdateReview;
  delete: DeleteReview;
}
