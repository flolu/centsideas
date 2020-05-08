import { injectable } from 'inversify';

import { IPushSubscription } from '@centsideas/models';
import { UnauthenticatedError, Identifier } from '@centsideas/utils';

import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationSettings } from './notification-settings.entity';
import { NotificationSettingsErrors } from './errors';
import {
  SubscribePushNotifications,
  UpdateNotificationSettings,
  GetNotificationSettings,
} from '@centsideas/rpc';

@injectable()
export class NotificationSettingsHandlers {
  constructor(private nsRepository: NotificationSettingsRepository) {}

  addPushSubscription: SubscribePushNotifications = async ({ subscription, userId }) => {
    UnauthenticatedError.validate(userId);
    NotificationSettingsErrors.PushSubscriptionInvalidError.validate(subscription);

    const ns = await this.getSettingsOfUser(userId);

    for (const sub of ns.persistedState.pushSubscriptions) {
      if (sub.endpoint === subscription.endpoint) {
        return ns.persistedState;
      }
    }

    ns.addPushSubscription(subscription);

    const saved = await this.nsRepository.save(ns);
    return saved.persistedState;
  };

  updateSettings: UpdateNotificationSettings = async ({ sendEmails, sendPushes, userId }) => {
    UnauthenticatedError.validate(userId);
    NotificationSettingsErrors.NotificationSettingsPayloadInvalidError.validate({
      sendPushes,
      sendEmails,
    });

    const ns = await this.getSettingsOfUser(userId);
    ns.update({ sendEmails, sendPushes });

    const updated = await this.nsRepository.save(ns);
    return updated.persistedState;
  };

  getSettings: GetNotificationSettings = async ({ userId }) => {
    UnauthenticatedError.validate(userId);

    const found = await this.getSettingsOfUser(userId);
    return found.persistedState;
  };

  async removeSubscriptions(
    notificationSettings: NotificationSettings,
    invalidSubscriptions: IPushSubscription[],
  ) {
    notificationSettings.removeSubscriptions(invalidSubscriptions);
    return this.nsRepository.save(notificationSettings);
  }

  getSettingsOfUser = async (userId: string) => {
    UnauthenticatedError.validate(userId);

    const existingMapping = await this.nsRepository.userIdMapping.get(userId);
    if (existingMapping) {
      const existingNs = await this.nsRepository.findById(existingMapping.notificationSettingsId);
      return existingNs;
    }

    const nsId = Identifier.makeLongId();
    const ns = NotificationSettings.create(nsId, userId);
    await this.nsRepository.userIdMapping.insert(nsId, userId);

    return this.nsRepository.save(ns);
  };
}
