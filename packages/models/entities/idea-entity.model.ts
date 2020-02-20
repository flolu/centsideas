export interface IIdeaState {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  lastEventId: string;
}
