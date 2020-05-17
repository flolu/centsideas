import {IEventEntityBase} from './event-base.model';

export interface IIdeaState extends IEventEntityBase {
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string;
}
