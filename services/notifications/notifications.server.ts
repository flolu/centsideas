import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters, handleHttpResponseError } from '@centsideas/utils';
import { UsersApiRoutes, NotificationsApiRoutes, HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, Dtos } from '@centsideas/models';

import { NotificationEnvironment } from './environment';
import { NotificationSettingsHandlers } from './notification-settings.handlers';

@injectable()
export class NotificationsServer {
  private app = express();

  // FIXME is there any way to remove push subscriptions that have no service worker anymore?!
  // TODO listen for push events (e.g. user creationg, email change, ...)

  constructor(
    // TODO make env service injectable on all backend services
    private env: NotificationEnvironment,
    private notificationSettingsHandlers: NotificationSettingsHandlers,
  ) {
    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(
      `/${NotificationsApiRoutes.SubscribePush}`,
      ExpressAdapters.json(this.subscribePush),
    );
    this.app.post(`/${NotificationsApiRoutes.Update}`, ExpressAdapters.json(this.updateSettings));

    this.app.get(`/${UsersApiRoutes.Alive}`, (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  }

  subscribePush = (req: HttpRequest<Dtos.ISubscribePushDto>): Promise<HttpResponse> =>
    Logger.thread('subscribe to push', async t => {
      try {
        const { subscription } = req.body;
        const auid = req.locals.userId || '';

        await this.notificationSettingsHandlers.upsert(auid, t);
        const ns = await this.notificationSettingsHandlers.addPushSubscription(
          auid,
          subscription,
          t,
        );

        // TODO send sample push notification ("this is how you'll be notified")

        return {
          status: HttpStatusCodes.Accepted,
          // FIXME maybe do not return push subscription array
          body: ns.persistedState,
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  async updateSettings(req: HttpRequest): Promise<HttpResponse> {
    throw new Error('not implemented');
  }
}
