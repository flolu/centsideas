import { IPushSubscription } from '../entities';

export interface ISubscribePushDto {
  subscription: IPushSubscription;
}

export interface INotificationSettingsDto {
  sendPushes: boolean;
  sendEmails: boolean;
}
