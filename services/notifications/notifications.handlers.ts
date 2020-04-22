import { injectable } from 'inversify';
import * as webpush from 'web-push';

import {
  HttpStatusCodes,
  NotificationMedium,
  TopLevelFrontendRoutes,
  EventTopics,
} from '@centsideas/enums';
import { ThreadLogger, Identifier } from '@centsideas/utils';
import {
  IPushSubscription,
  IIdeaCreatedEvent,
  ILoginRequestedEvent,
  IEmailChangeRequestedEvent,
  IEmailChangeConfirmedEvent,
} from '@centsideas/models';

import { NotificationEnvironment } from './notifications.environment';
import { IPushPayload } from './models';
import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { IEvent } from '@centsideas/event-sourcing';
import { Notification } from './notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { EmailService } from './email.service';

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
    t: ThreadLogger,
  ) {
    webpush.setVapidDetails(
      `${this.env.frontendUrl}/contact`,
      this.env.vapidPublicKey,
      this.env.vapidPrivateKey,
    );

    const ns = await this.notificationSettingsHandlers.getSettingsOfUser(userId);
    t.debug('found settings');

    if (!ns.persistedState.sendPushes) {
      t.debug(`push notifications are disabled`);
      return false;
    }

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

    t.debug(`start sending notification to ${ns.persistedState.pushSubscriptions.length} clients`);
    const invalidSubscriptions: IPushSubscription[] = [];
    await Promise.all(
      ns.persistedState.pushSubscriptions.map(sub =>
        webpush.sendNotification(sub, JSON.stringify(payload)).catch(error => {
          if (error.statusCode === HttpStatusCodes.Gone) invalidSubscriptions.push(sub);
          else throw error;
        }),
      ),
    );
    t.debug(
      `sent ${
        ns.persistedState.pushSubscriptions.length - invalidSubscriptions.length
      } notificatios`,
    );

    notification.sent();
    await this.notificationsRepository.save(notification);
    await this.notificationSettingsHandlers.removeSubscriptions(ns, invalidSubscriptions);
    return true;
  }

  handleIdeaCreatedNotification(event: IEvent<IIdeaCreatedEvent>, t: ThreadLogger) {
    const pushPayload: IPushPayload = {
      notification: {
        title: 'Your Idea has been Published',
        body: event.data.title,
        data: {
          url: `/${TopLevelFrontendRoutes.Ideas}/${event.aggregateId}`,
        },
      },
    };

    return this.sendPushNotificationToUser(
      event.data.userId,
      pushPayload,
      event,
      EventTopics.Ideas,
      t,
    );
  }

  async handleLoginNotification(event: IEvent<ILoginRequestedEvent>, t: ThreadLogger) {
    t.debug(`start sending login email to ${event.data.email}`);

    const notificationId = Identifier.makeLongId();
    const notification = Notification.create(
      notificationId,
      null,
      { eventId: event.id, eventName: event.name, topic: EventTopics.Logins },
      NotificationMedium.Email,
    );

    await this.emailService.sendLoginMail(
      event.data.email,
      event.data.token,
      event.data.firstLogin,
    );

    notification.sent();
    await this.notificationsRepository.save(notification);
    t.debug('sent login email');
  }

  async handleEmailChangeRequestedNotification(
    event: IEvent<IEmailChangeRequestedEvent>,
    t: ThreadLogger,
  ) {
    t.debug(`start sending request email change email to ${event.data.email}`);

    const notificationId = Identifier.makeLongId();
    const notification = Notification.create(
      notificationId,
      null,
      { eventId: event.id, eventName: event.name, topic: EventTopics.Logins },
      NotificationMedium.Email,
    );

    await this.emailService.sendRequestEmailChangeEmail(event.data.email, event.data.token);

    notification.sent();
    await this.notificationsRepository.save(notification);
    t.debug('sent');
  }

  async handleEmailChangedNotification(event: IEvent<IEmailChangeConfirmedEvent>, t: ThreadLogger) {
    t.debug(`start sending email change confirmed email to ${event.data.oldEmail}`);

    const notificationId = Identifier.makeLongId();
    const notification = Notification.create(
      notificationId,
      null,
      { eventId: event.id, eventName: event.name, topic: EventTopics.Logins },
      NotificationMedium.Email,
    );

    await this.emailService.sendEmailChangedEmail(event.data.oldEmail, event.data.newEmail);

    notification.sent();
    await this.notificationsRepository.save(notification);
    t.debug('sent');
  }
}
