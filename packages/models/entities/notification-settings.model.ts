import { IEventEntityBase } from './event-base.model';

export interface INotificationSettingsState extends IEventEntityBase {
  userId: string;
}

export interface IPushSubscription {
  endpoint: string;
  expirationTime: string | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}
