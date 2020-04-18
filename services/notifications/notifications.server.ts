import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters, handleHttpResponseError } from '@centsideas/utils';
import { UsersApiRoutes, NotificationsApiRoutes, HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, Dtos } from '@centsideas/models';

import { NotificationEnvironment } from './environment';
// import { NotificationsHandlers } from './notifications.handlers';

@injectable()
export class NotificationsServer {
  private app = express();

  // TODO listen for push events

  constructor(
    // TODO make env service injectable on all backend services
    private env: NotificationEnvironment, // private notificationHandlers: NotificationsHandlers,
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
        // const { subscription } = req.body;
        // const auid = req.locals.userId;

        // const notificationSetting = await this.notificationHandlers.upsertSubscriptionSettings();
        // await this.notificationHandlers.addPushSubscription();

        // TODO send sample push notification ("this is how you'll be notified")

        // TODO move this fixme to appropriate place
        // FIXME is there any way to remove push subscriptions that have no service worker anymore?!

        return {
          status: HttpStatusCodes.Accepted,
          body: {},
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  async updateSettings(req: HttpRequest): Promise<HttpResponse> {
    throw new Error('not implemented');
  }
}
