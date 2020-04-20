import { PushSubscriptionInvalidError } from './push-subscription-invalid.error';
import { NotificationSettingsNotFoundError } from './notification-settings-not-found.error';
import { NoNotificationSettingsWithUserIdFoundError } from './no-notification-settings-with-userid-found.error';
import { NotificationSettingsPayloadInvalid } from './notification-settings-payload-invalid.error';

export const NotificationSettingsErrors = {
  PushSubscriptionInvalidError,
  NotificationSettingsNotFoundError,
  NoNotificationSettingsWithUserIdFoundError,
  NotificationSettingsPayloadInvalid,
};
