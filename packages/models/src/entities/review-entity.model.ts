export interface IReviewState {
  id: string;
  ideaId: string;
  content: string;
  scores: IReviewScores;
  createdAt: string | null;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  draft: { content: string; scores: IReviewScores } | null;
}

export interface IReviewScores {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}
