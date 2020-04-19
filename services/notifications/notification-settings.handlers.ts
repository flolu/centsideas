import { injectable } from 'inversify';

import { IPushSubscription } from '@centsideas/models';
import { ThreadLogger, NotAuthenticatedError, Identifier } from '@centsideas/utils';

import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationSettings } from './notification-settings.entity';
import { NotificationSettingsErrors } from './errors';

@injectable()
export class NotificationSettingsHandlers {
  constructor(private nsRepository: NotificationSettingsRepository) {}

  async upsert(authenticatedUserId: string, t: ThreadLogger): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(authenticatedUserId);
    t.debug(`start creating notification settings for ${authenticatedUserId}`);

    const existingMapping = await this.nsRepository.userIdMapping.get(authenticatedUserId);
    if (existingMapping) {
      const existingNs = await this.nsRepository.findById(existingMapping.notificationSettingsId);
      t.debug(
        `found existing notification settings with it ${existingMapping.notificationSettingsId}`,
      );
      return existingNs;
    }

    const nsId = Identifier.makeLongId();
    const ns = NotificationSettings.create(nsId, authenticatedUserId);
    await this.nsRepository.userIdMapping.insert(nsId, authenticatedUserId);

    t.debug(`start creating seettings with id ${nsId}`);
    return this.nsRepository.save(ns);
  }

  async addPushSubscription(
    authenticatedUserId: string,
    subscription: IPushSubscription,
    t: ThreadLogger,
  ): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(authenticatedUserId);
    NotificationSettingsErrors.PushSubscriptionInvalidError.validate(subscription);

    const mapping = await this.nsRepository.userIdMapping.get(authenticatedUserId);
    if (!mapping)
      throw new NotificationSettingsErrors.NoNotificationSettingsWithUserIdFoundError(
        authenticatedUserId,
      );
    t.debug(`found mapping, notificationSettingsId is: ${mapping.notificationSettingsId}`);

    const ns = await this.nsRepository.findById(mapping.notificationSettingsId);
    ns.addPushSubscription(subscription);

    t.debug(`adding push subscription to settings`);
    return this.nsRepository.save(ns);
  }
}
