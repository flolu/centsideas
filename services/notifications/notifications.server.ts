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
  TopLevelFrontendRoutes,
} from '@centsideas/enums';
import { HttpRequest, HttpResponse, Dtos, IIdeaCreatedEvent } from '@centsideas/models';
import { MessageBroker, IEvent } from '@centsideas/event-sourcing';

import { NotificationEnvironment } from './environment';
import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { IPushPayload } from './models';

@injectable()
export class NotificationsServer {
  private app = express();

  // FIXME is there any way to remove push subscriptions that have no service worker anymore?!
  // TODO listen for push events (e.g. user creationg, email change, ...)

  constructor(
    // TODO make env service injectable on all backend services
    private env: NotificationEnvironment,
    private notificationSettingsHandlers: NotificationSettingsHandlers,
    private messageBroker: MessageBroker,
  ) {
    this.messageBroker.initialize({ brokers: env.kafka.brokers });
    this.messageBroker.subscribe(EventTopics.Ideas, this.handleIdeasEvents);

    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(
      `/${NotificationsApiRoutes.SubscribePush}`,
      ExpressAdapters.json(this.subscribePush),
    );
    this.app.post(
      `/${NotificationsApiRoutes.UpdateSettings}`,
      ExpressAdapters.json(this.updateSettings),
    );
    this.app.post(`/${NotificationsApiRoutes.GetSettings}`, ExpressAdapters.json(this.getSettings));

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

  // TODO create notification events (NotificationSentEvent)
  private handleIdeasEvents = async (event: IEvent<any>) => {
    Logger.thread('handle incomming idea events', async t => {
      try {
        if (event.name === IdeaEvents.IdeaCreated) {
          const createdEevent: IEvent<IIdeaCreatedEvent> = event;
          const pushPayload: IPushPayload = {
            notification: {
              title: 'Your Idea has been Published',
              body: createdEevent.data.title,
              data: {
                url: `/${TopLevelFrontendRoutes.Ideas}/${createdEevent.aggregateId}`,
              },
            },
          };
          await this.notificationSettingsHandlers.sendPushNotificationToUser(
            createdEevent.data.userId,
            pushPayload,
            t,
          );
        }
      } catch (error) {
        t.error(`Error while sending idea-created push notification`, error);
      }
    });
  };
}
