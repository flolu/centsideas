export interface IReviewCreatedEvent {
  reviewId: string;
  ideaId: string;
}

export interface IReviewScores {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}

export interface IReviewDraftSavedEvent {
  content?: string;
  scores?: IReviewScores;
}

export interface IReviewPublishedEvent {}
