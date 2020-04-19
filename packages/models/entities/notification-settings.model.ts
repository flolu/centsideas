import { IEventEntityBase } from './event-base.model';

export interface INotificationSettingsState extends IEventEntityBase {
  userId: string;
  pushSubscriptions: IPushSubscription[];
  sendPushes: boolean;
  sendEmails: boolean;
}

export interface IPushSubscription {
  endpoint: string;
  expirationTime: string | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}
