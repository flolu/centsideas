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
import { HttpRequest, HttpResponse, Dtos, IEvent } from '@centsideas/models';
import { MessageBroker } from '@centsideas/event-sourcing';

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
    this.messageBroker.events(EventTopics.Ideas).subscribe(this.handleIdeasEvents);
    this.messageBroker.events(EventTopics.Logins).subscribe(this.handleLoginEvents);
    this.messageBroker.events(EventTopics.Users).subscribe(this.handleUsersEvents);

    Logger.info('launch in', this.env.environment, 'mode');
    this.app.use(bodyParser.json());

    this.app.post(`/${this.routes.SubscribePush}`, ExpressAdapters.json(this.subscribePush));
    this.app.post(`/${this.routes.UpdateSettings}`, ExpressAdapters.json(this.updateSettings));
    this.app.post(`/${this.routes.GetSettings}`, ExpressAdapters.json(this.getSettings));

    this.app.get(`/${UsersApiRoutes.Alive}`, (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  }

  private subscribePush = async (
    req: HttpRequest<Dtos.ISubscribePushDto>,
  ): Promise<HttpResponse> => {
    const { subscription } = req.body;
    const auid = req.locals.userId || '';

    const upserted = await this.notificationSettingsHandlers.upsert(auid);
    const ns = await this.notificationSettingsHandlers.addPushSubscription(
      upserted.persistedState.id,
      auid,
      subscription,
    );

    return {
      status: HttpStatusCodes.Accepted,
      // FIXME maybe do not return push subscription array
      body: ns.persistedState,
    };
  };

  private updateSettings = async (
    req: HttpRequest<Dtos.INotificationSettingsDto>,
  ): Promise<HttpResponse<Dtos.INotificationSettingsDto>> => {
    {
      const auid = req.locals.userId || '';
      const settings = req.body;

      const upserted = await this.notificationSettingsHandlers.upsert(auid);
      const updated = await this.notificationSettingsHandlers.updateSettings(
        upserted.persistedState.id,
        auid,
        settings,
      );

      return {
        status: HttpStatusCodes.Accepted,
        body: updated.persistedState,
      };
    }
  };

  private getSettings = async (
    req: HttpRequest,
  ): Promise<HttpResponse<Dtos.INotificationSettingsDto>> => {
    {
      try {
        const auid = req.locals.userId || '';

        const settings = await this.notificationSettingsHandlers.upsert(auid);

        return {
          status: HttpStatusCodes.Accepted,
          body: settings.persistedState,
        };
      } catch (error) {
        if (error.status === HttpStatusCodes.NotFound)
          return {
            status: HttpStatusCodes.Accepted,
            body: { sendEmails: false, sendPushes: false },
          };

        return handleHttpResponseError(error);
      }
    }
  };

  private handleIdeasEvents = async (event: IEvent<any>) => {
    try {
      switch (event.name) {
        case IdeaEvents.IdeaCreated:
          return this.notificationsHandler.handleIdeaCreatedNotification(event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  private handleLoginEvents = async (event: IEvent<any>) => {
    try {
      switch (event.name) {
        case LoginEvents.LoginRequested:
          return this.notificationsHandler.handleLoginNotification(event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  private handleUsersEvents = async (event: IEvent<any>) => {
    try {
      switch (event.name) {
        case UserEvents.EmailChangeRequested:
          return this.notificationsHandler.handleEmailChangeRequestedNotification(event);

        case UserEvents.EmailChangeConfirmed:
          return this.notificationsHandler.handleEmailChangedNotification(event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };
}
