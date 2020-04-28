import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { ApiEndpoints } from '@centsideas/enums';

import { ReviewsRoutes } from './reviews.routes';
import { IdeasRoutes } from './ideas.routes';
import { UsersRoutes } from './users.routes';
import { NotificationsRoutes } from './notifications.routes';
import { GatewayMiddlewares } from './gateway.middlewares';
import { GatewayEnvironment } from './gateway.environment';
import { AdminRoutes } from './admin.routes';

@injectable()
export class GatewayServer {
  private app = express();

  constructor(
    private ideasRoutes: IdeasRoutes,
    private usersRoutes: UsersRoutes,
    private reviewsRoutes: ReviewsRoutes,
    private notificationsRoutes: NotificationsRoutes,
    private middlewares: GatewayMiddlewares,
    private env: GatewayEnvironment,
    private adminRoutes: AdminRoutes,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');

    this.app.use(this.middlewares.cors);
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    // FIXME does this middleware hurt performance? if it has a big impact we could just use the middleware on the routes where it is really necessary
    this.app.use(this.middlewares.auth);

    this.registerServiceRoutes();

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => res.status(200).send('gateway alive'));
    this.app.listen(this.env.port);
  }

  // TODO maybe just setup those routes directly in this class? ... or at least don't inject them?
  private registerServiceRoutes() {
    this.app.use(
      `/${ApiEndpoints.Ideas}`,
      this.ideasRoutes.setup(this.env.ideasHost, this.env.consumerHost),
    );

    this.app.use(`/${ApiEndpoints.Reviews}`, this.reviewsRoutes.setup(this.env.reviewsHost));

    this.app.use(
      `/${ApiEndpoints.Users}`,
      this.usersRoutes.setup(this.env.usersHost, this.env.consumerHost),
    );

    this.app.use(
      `/${ApiEndpoints.Notifications}`,
      this.notificationsRoutes.setup(this.env.notificationsHost),
    );

    this.app.use(`/${ApiEndpoints.Admin}`, this.adminRoutes.setup(this.env.adminHost));
  }
}
