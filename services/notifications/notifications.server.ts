import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters, handleHttpResponseError } from '@centsideas/utils';
import {
  UsersApiRoutes,
  NotificationsApiRoutes,
  HttpStatusCodes,
  EventTopics,
  IdeaEvents,
  LoginEvents,
  UserEvents,
} from '@centsideas/enums';
import { HttpRequest, HttpResponse, Dtos } from '@centsideas/models';
import { MessageBroker, IEvent } from '@centsideas/event-sourcing';

import { NotificationEnvironment } from './notifications.environment';
import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { NotificationsHandlers } from './notifications.handlers';

@injectable()
export class NotificationsServer {
  private app = express();
  private routes = NotificationsApiRoutes;

  constructor(
    private env: NotificationEnvironment,
    private notificationSettingsHandlers: NotificationSettingsHandlers,
    private messageBroker: MessageBroker,
    private notificationsHandler: NotificationsHandlers,
  ) {
    this.messageBroker.initialize({ brokers: env.kafka.brokers });
    this.messageBroker.subscribe(EventTopics.Ideas, this.handleIdeasEvents);
    this.messageBroker.subscribe(EventTopics.Logins, this.handleLoginEvents);
    this.messageBroker.subscribe(EventTopics.Users, this.handleUsersEvents);

    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(`/${this.routes.SubscribePush}`, ExpressAdapters.json(this.subscribePush));
    this.app.post(`/${this.routes.UpdateSettings}`, ExpressAdapters.json(this.updateSettings));
    this.app.post(`/${this.routes.GetSettings}`, ExpressAdapters.json(this.getSettings));

    this.app.get(`/${UsersApiRoutes.Alive}`, (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  }

  private subscribePush = (req: HttpRequest<Dtos.ISubscribePushDto>): Promise<HttpResponse> =>
    Logger.thread('subscribe to push', async t => {
      try {
        const { subscription } = req.body;
        const auid = req.locals.userId || '';

        const upserted = await this.notificationSettingsHandlers.upsert(auid, t);
        t.debug('upserted notification settings');
        const ns = await this.notificationSettingsHandlers.addPushSubscription(
          upserted.persistedState.id,
          auid,
          subscription,
          t,
        );
        t.debug('fetched settings');

        return {
          status: HttpStatusCodes.Accepted,
          // FIXME maybe do not return push subscription array
          body: ns.persistedState,
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  private updateSettings = (
    req: HttpRequest<Dtos.INotificationSettingsDto>,
  ): Promise<HttpResponse<Dtos.INotificationSettingsDto>> => {
    return Logger.thread('update settings', async t => {
      try {
        const auid = req.locals.userId || '';
        const settings = req.body;

        const upserted = await this.notificationSettingsHandlers.upsert(auid, t);
        const updated = await this.notificationSettingsHandlers.updateSettings(
          upserted.persistedState.id,
          auid,
          settings,
          t,
        );
        t.debug(`updated settings`);

        return {
          status: HttpStatusCodes.Accepted,
          body: updated.persistedState,
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });
  };

  private getSettings = (
    req: HttpRequest,
  ): Promise<HttpResponse<Dtos.INotificationSettingsDto>> => {
    return Logger.thread('get settings', async t => {
      try {
        const auid = req.locals.userId || '';

        const settings = await this.notificationSettingsHandlers.upsert(auid, t);

        return {
          status: HttpStatusCodes.Accepted,
          body: settings.persistedState,
        };
      } catch (error) {
        if (error.status === HttpStatusCodes.NotFound)
          return { status: HttpStatusCodes.Accepted, body: {} };

        return handleHttpResponseError(error, t);
      }
    });
  };

  private handleIdeasEvents = (event: IEvent<any>) => {
    Logger.thread('handle incomming idea events', async t => {
      try {
        switch (event.name) {
          case IdeaEvents.IdeaCreated:
            return this.notificationsHandler.handleIdeaCreatedNotification(event, t);
        }
      } catch (error) {
        t.error(error);
      }
    });
  };

  private handleLoginEvents = (event: IEvent<any>) => {
    Logger.thread('handle incomming login event', async t => {
      try {
        switch (event.name) {
          case LoginEvents.LoginRequested:
            return this.notificationsHandler.handleLoginNotification(event, t);
        }
      } catch (error) {
        t.error(error);
      }
    });
  };

  private handleUsersEvents = (event: IEvent<any>) => {
    Logger.thread('handle incomming users event', async t => {
      try {
        switch (event.name) {
          case UserEvents.EmailChangeRequested:
            return this.notificationsHandler.handleEmailChangeRequestedNotification(event, t);

          case UserEvents.EmailChangeConfirmed:
            return this.notificationsHandler.handleEmailChangedNotification(event, t);
        }
      } catch (error) {
        t.error(error);
      }
    });
  };
}
