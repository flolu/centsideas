export interface ReviewModel {
  id: string;
  authorUserId: string;
  receiverUserId: string;
  ideaId: string;
  content: string | undefined;
  score: Score | undefined;
  publishedAt: string | undefined;
  updatedAt: string;
  lastEventVersion: number;
}

export interface CreatedData {
  id: string;
  authorUserId: string;
  receiverUserId: string;
  ideaId: string;
  createdAt: string;
}

export interface ContentEditedData {
  content: string;
}

export interface ScoreChangedData {
  score: Score;
}

export interface PublishedData {
  publishedAt: string;
}

export interface Score {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}
