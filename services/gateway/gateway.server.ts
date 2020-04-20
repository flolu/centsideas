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
  ) {}

  start = () => {
    Logger.log('launch', this.env.environment);

    this.app.use(this.middlewares.cors);
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    // FIXME does this middleware hurt performance? if it has a big impact we could just use the middleware on the routes where it is really necessary
    this.app.use(this.middlewares.auth);

    this.app.use(
      `/${ApiEndpoints.Ideas}`,
      this.ideasRoutes.setup(this.env.hosts.ideas, this.env.hosts.consumer),
    );
    this.app.use(`/${ApiEndpoints.Reviews}`, this.reviewsRoutes.setup(this.env.hosts.reviews));
    this.app.use(
      `/${ApiEndpoints.Users}`,
      this.usersRoutes.setup(this.env.hosts.users, this.env.hosts.consumer),
    );

    this.app.use(
      `/${ApiEndpoints.Notifications}`,
      this.notificationsRoutes.setup(this.env.hosts.notifications),
    );

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => res.status(200).send('gateway alive'));
    this.app.get(`**`, (_req, res) => res.status(200).send(`centsideas gateway 404`));
    this.app.listen(this.env.port);
  };
}
