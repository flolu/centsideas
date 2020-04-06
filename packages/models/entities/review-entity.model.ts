export interface IReviewState {
  id: string;
  ideaId: string;
  userId: string;
  content: string;
  scores: IReviewScores;
  deleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  lastEventId: string;
}

export interface IReviewScores {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}
