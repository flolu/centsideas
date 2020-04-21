import { IPushSubscription } from '../entities';

export interface INotificationSettingsCreatedEvent {
  notificationSettingsId: string;
  userId: string;
}

export interface INotificationSettingsUpdatedEvent {
  sendEmails: boolean;
  sendPushes: boolean;
}

export interface IPushSubscriptionAddedEvent {
  subscription: IPushSubscription;
}

export interface IPushSubscriptionsRemovedEvent {
  subscriptions: IPushSubscription[];
}
