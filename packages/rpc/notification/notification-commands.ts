import { INotificationSettingsState, IPushSubscription } from '@centsideas/models';

interface ISubscribePushNotificationsCommand {
  subscription: IPushSubscription;
  userId: string;
}

interface IUpdateNotificationSettingsCommand {
  sendPushes: boolean;
  sendEmails: boolean;
  userId: string;
}

interface IGetNotificationSettingsCommand {
  userId: string;
}

export type SubscribePushNotifications = (
  payload: ISubscribePushNotificationsCommand,
) => Promise<INotificationSettingsState>;

export type UpdateNotificationSettings = (
  payload: IUpdateNotificationSettingsCommand,
) => Promise<INotificationSettingsState>;

export type GetNotificationSettings = (
  payload: IGetNotificationSettingsCommand,
) => Promise<INotificationSettingsState>;

export interface INotificationCommands {
  subscribePush: SubscribePushNotifications;
  updateSettings: UpdateNotificationSettings;
  getSettings: GetNotificationSettings;
}
