import {IEventEntityBase} from './event-base.model';

export interface IUserState extends IEventEntityBase {
  username: string;
  email: string;
  pendingEmail: string;
  createdAt: string;
  updatedAt: string;
  refreshTokenId: string;
}
