import {NotificationMedium} from '@centsideas/enums';

import {IEventEntityBase} from './event-base.model';
import {IInResponseTo} from '..';

export interface INotificationState extends IEventEntityBase {
  receiverUserId: string | null;
  inResponseTo: IInResponseTo | null;
  medium: NotificationMedium | null;
  sentAt: string | null;
}
