import { injectable } from 'inversify';
import * as webpush from 'web-push';

import { IPushSubscription, Dtos } from '@centsideas/models';
import { ThreadLogger, NotAuthenticatedError, Identifier } from '@centsideas/utils';

import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationSettings } from './notification-settings.entity';
import { NotificationSettingsErrors } from './errors';
import { NotificationEnvironment } from './environment';
import { IPushPayload } from './models';

@injectable()
export class NotificationSettingsHandlers {
  constructor(
    private nsRepository: NotificationSettingsRepository,
    private env: NotificationEnvironment,
  ) {}

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
    nsId: string,
    auid: string,
    subscription: IPushSubscription,
    t: ThreadLogger,
  ): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(auid);
    NotificationSettingsErrors.PushSubscriptionInvalidError.validate(subscription);

    const ns = await this.nsRepository.findById(nsId);
    ns.addPushSubscription(subscription);

    t.debug(`adding push subscription to settings`);
    return this.nsRepository.save(ns);
  }

  async updateSettings(
    nsId: string,
    auid: string,
    settings: Dtos.INotificationSettingsDto,
    t: ThreadLogger,
  ): Promise<NotificationSettings> {
    NotAuthenticatedError.validate(auid);
    NotificationSettingsErrors.NotificationSettingsPayloadInvalid.validate(settings);
    t.debug('request is valid');

    const ns = await this.nsRepository.findById(nsId);
    t.debug('found settings');
    ns.update(settings.sendEmails, settings.sendPushes);

    t.debug('start saving updated settings');
    return this.nsRepository.save(ns);
  }

  async sendPushNotificationToUser(userId: string, payload: IPushPayload, t: ThreadLogger) {
    NotAuthenticatedError.validate(userId);

    webpush.setVapidDetails(
      `${this.env.frontendUrl}/contact`,
      this.env.vapidPublicKey,
      this.env.vapidPrivateKey,
    );

    const ns = await this.getSettingsOfUser(userId);
    t.debug('found settings');

    if (!ns.persistedState.sendPushes) {
      t.debug(`push notifications are disabled`);
      return true;
    }

    t.debug(`start sending notification to ${ns.persistedState.pushSubscriptions.length} clients`);
    await Promise.all(
      ns.persistedState.pushSubscriptions.map(sub =>
        webpush.sendNotification(sub, JSON.stringify(payload)),
      ),
    );
    t.debug('sent notificatios');

    return true;
  }

  async getSettings(auid: string) {
    NotAuthenticatedError.validate(auid);
    return this.getSettingsOfUser(auid);
  }

  private async getSettingsOfUser(userId: string) {
    const mapping = await this.nsRepository.userIdMapping.get(userId);
    if (!mapping)
      throw new NotificationSettingsErrors.NoNotificationSettingsWithUserIdFoundError(userId);

    const notificationSettings = await this.nsRepository.findById(mapping.notificationSettingsId);
    if (!notificationSettings)
      throw new NotificationSettingsErrors.NotificationSettingsNotFoundError(
        mapping.notificationSettingsId,
      );

    return notificationSettings;
  }
}
