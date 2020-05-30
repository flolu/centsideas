import {injectable} from 'inversify';
import * as webpush from 'web-push';

import {NotificationMedium, EventTopics} from '@centsideas/enums';
import {Identifier} from '@centsideas/utils';
import {
  IPushSubscription,
  ILoginRequestedEvent,
  IEmailChangeRequestedEvent,
  IEmailChangeConfirmedEvent,
  IEvent,
} from '@centsideas/models';

import {NotificationEnvironment} from './notifications.environment';
import {IPushPayload} from './models';
import {NotificationSettingsHandlers} from './notification-settings.handlers';
import {Notification} from './notification.entity';
import {NotificationsRepository} from './notifications.repository';
import {EmailService} from './email.service';

@injectable()
export class NotificationsHandlers {
  constructor(
    private env: NotificationEnvironment,
    private notificationSettingsHandlers: NotificationSettingsHandlers,
    private notificationsRepository: NotificationsRepository,
    private emailService: EmailService,
  ) {}

  async sendPushNotificationToUser(
    userId: string,
    payload: IPushPayload,
    responseEvent: IEvent,
    eventTopic: string,
  ) {
    webpush.setVapidDetails(
      `${this.env.frontendUrl}/contact`,
      this.env.vapidPublicKey,
      this.env.vapidPrivateKey,
    );

    const ns = await this.notificationSettingsHandlers.getSettingsOfUser(userId);
    if (!ns.persistedState.sendPushes || !ns.persistedState.pushSubscriptions.length) return false;

    const notification = Notification.create(
      Identifier.makeLongId(),
      responseEvent.data.userId,
      {
        eventId: responseEvent.id,
        eventName: responseEvent.name,
        topic: eventTopic,
      },
      NotificationMedium.PushNotification,
    );

    const invalidSubscriptions: IPushSubscription[] = [];
    await Promise.all(
      ns.persistedState.pushSubscriptions.map(sub =>
        webpush.sendNotification(sub, JSON.stringify(payload)).catch(error => {
          if (error.statusCode === 410) invalidSubscriptions.push(sub);
          else throw error;
        }),
      ),
    );

    notification.sent();
    await this.notificationsRepository.save(notification);
    if (invalidSubscriptions.length)
      await this.notificationSettingsHandlers.removeSubscriptions(ns, invalidSubscriptions);
    return true;
  }

  async handleLoginNotification(event: IEvent<ILoginRequestedEvent>) {
    const notificationId = Identifier.makeLongId();
    const notification = Notification.create(
      notificationId,
      null,
      {eventId: event.id, eventName: event.name, topic: EventTopics.Logins},
      NotificationMedium.Email,
    );

    await this.emailService.sendLoginMail(
      event.data.email,
      event.data.token,
      event.data.firstLogin,
    );

    notification.sent();
    await this.notificationsRepository.save(notification);
  }

  async handleEmailChangeRequestedNotification(event: IEvent<IEmailChangeRequestedEvent>) {
    const notificationId = Identifier.makeLongId();
    const notification = Notification.create(
      notificationId,
      null,
      {eventId: event.id, eventName: event.name, topic: EventTopics.Logins},
      NotificationMedium.Email,
    );

    await this.emailService.sendRequestEmailChangeEmail(event.data.email, event.data.token);

    notification.sent();
    await this.notificationsRepository.save(notification);
  }

  async handleEmailChangedNotification(event: IEvent<IEmailChangeConfirmedEvent>) {
    const notificationId = Identifier.makeLongId();
    const notification = Notification.create(
      notificationId,
      null,
      {eventId: event.id, eventName: event.name, topic: EventTopics.Logins},
      NotificationMedium.Email,
    );

    await this.emailService.sendEmailChangedEmail(event.data.oldEmail, event.data.newEmail);

    notification.sent();
    await this.notificationsRepository.save(notification);
  }
}
