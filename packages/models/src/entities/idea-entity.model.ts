export interface IIdeaState {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string | null;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  draft: { title: string; description: string } | null;
  lastEventId: string;
}
