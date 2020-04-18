import { IEventEntityBase } from './event-base.model';

export interface IUserState extends IEventEntityBase {
  username: string;
  email: string;
  pendingEmail: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  refreshTokenId: string;
}
