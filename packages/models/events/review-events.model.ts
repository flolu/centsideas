import { IReviewScores } from '../entities';

export interface IReviewCreatedEvent {
  reviewId: string;
  ideaId: string;
  userId: string;
}

export interface IReviewDraftSavedEvent {
  content?: string;
  scores?: IReviewScores;
}

export interface IReviewUpdatedEvent {
  content?: string;
  scores?: IReviewScores;
}

export interface IReviewPublishedEvent {}
