import { injectable } from 'inversify';

import { IPushSubscription, Dtos } from '@centsideas/models';
import { NotAuthenticatedError, Identifier } from '@centsideas/utils';

import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationSettings } from './notification-settings.entity';
import { NotificationSettingsErrors } from './errors';

@injectable()
export class NotificationSettingsHandlers {
  constructor(private nsRepository: NotificationSettingsRepository) {}

  async upsert(authenticatedUserId: string): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(authenticatedUserId);

    const existingMapping = await this.nsRepository.userIdMapping.get(authenticatedUserId);
    if (existingMapping) {
      const existingNs = await this.nsRepository.findById(existingMapping.notificationSettingsId);
      return existingNs;
    }

    const nsId = Identifier.makeLongId();
    const ns = NotificationSettings.create(nsId, authenticatedUserId);
    await this.nsRepository.userIdMapping.insert(nsId, authenticatedUserId);

    return this.nsRepository.save(ns);
  }

  async addPushSubscription(
    nsId: string,
    auid: string,
    subscription: IPushSubscription,
  ): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(auid);
    NotificationSettingsErrors.PushSubscriptionInvalidError.validate(subscription);

    const ns = await this.nsRepository.findById(nsId);

    for (const sub of ns.persistedState.pushSubscriptions) {
      if (sub.endpoint === subscription.endpoint) {
        return ns;
      }
    }

    ns.addPushSubscription(subscription);

    return this.nsRepository.save(ns);
  }

  async updateSettings(
    nsId: string,
    auid: string,
    settings: Dtos.INotificationSettingsDto,
  ): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(auid);
    NotificationSettingsErrors.NotificationSettingsPayloadInvalid.validate(settings);

    const ns = await this.nsRepository.findById(nsId);
    ns.update(settings.sendEmails, settings.sendPushes);

    return this.nsRepository.save(ns);
  }

  async getSettings(auid: string) {
    NotAuthenticatedError.validate(auid);
    return this.getSettingsOfUser(auid);
  }

  async removeSubscriptions(
    notificationSettings: NotificationSettings,
    invalidSubscriptions: IPushSubscription[],
  ) {
    notificationSettings.removeSubscriptions(invalidSubscriptions);
    return this.nsRepository.save(notificationSettings);
  }

  async getSettingsOfUser(userId: string) {
    const mapping = await this.nsRepository.userIdMapping.get(userId);
    if (!mapping)
      throw new NotificationSettingsErrors.NoNotificationSettingsWithUserIdFoundError(userId);

    return this.nsRepository.findById(mapping.notificationSettingsId);
  }
}
