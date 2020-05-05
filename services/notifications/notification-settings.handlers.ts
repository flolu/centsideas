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

    const upserted = await this.upsert(userId);
    const ns = await this.nsRepository.findById(upserted.persistedState.id);

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

    const upserted = await this.upsert(userId);
    const ns = await this.nsRepository.findById(upserted.persistedState.id);
    ns.update(sendEmails, sendPushes);

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
    const mapping = await this.nsRepository.userIdMapping.get(userId);
    if (!mapping)
      throw new NotificationSettingsErrors.NoNotificationSettingsWithUserIdFoundError(userId);

    return this.nsRepository.findById(mapping.notificationSettingsId);
  };

  private upsert = async (authenticatedUserId: string) => {
    UnauthenticatedError.validate(authenticatedUserId);

    const existingMapping = await this.nsRepository.userIdMapping.get(authenticatedUserId);
    if (existingMapping) {
      const existingNs = await this.nsRepository.findById(existingMapping.notificationSettingsId);
      return existingNs;
    }

    const nsId = Identifier.makeLongId();
    const ns = NotificationSettings.create(nsId, authenticatedUserId);
    await this.nsRepository.userIdMapping.insert(nsId, authenticatedUserId);

    return this.nsRepository.save(ns);
  };
}
