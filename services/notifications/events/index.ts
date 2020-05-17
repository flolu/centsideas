import {composeCommitFunctions} from '@centsideas/event-sourcing';
import {INotificationSettingsState, INotificationState} from '@centsideas/models';

import {NotificationSettingsCreatedEvent} from './notification-settings-created.event';
import {NotificationSettingsUpdatedEvent} from './notification-settings-updated.event';
import {PushSubscriptionAddedEvent} from './push-subscription-added.event';
import {PushSubscriptionsRemovedEvent} from './push-subscriptions-removed.event';
import {NotificationCreatedEvent} from './notification-created.event';
import {NotificationSentEvent} from './notification-sent.event';

export const NotificationSettingsEvents = {
  NotificationSettingsCreatedEvent,
  NotificationSettingsUpdatedEvent,
  PushSubscriptionAddedEvent,
  PushSubscriptionsRemovedEvent,
};
export const NotificationsEvents = {
  NotificationCreatedEvent,
  NotificationSentEvent,
};

export const notificationSettingsCommitFunctions = composeCommitFunctions<
  INotificationSettingsState
>(NotificationSettingsEvents);

export const notificationsCommitFunctions = composeCommitFunctions<INotificationState>(
  NotificationsEvents,
);
