import {IEventEntityBase} from './event-base.model';

export interface ILoginState extends IEventEntityBase {
  email: string;
  confirmedAt: string | null;
  confirmedByUserId: string | null;
  createdAt: string | null;
}
