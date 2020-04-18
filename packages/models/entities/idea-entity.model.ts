import { IEventEntityBase } from './event-base.model';

export interface IIdeaState extends IEventEntityBase {
  userId: string;
  title: string;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
}
