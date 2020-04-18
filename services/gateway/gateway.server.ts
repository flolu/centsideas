import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { ApiEndpoints } from '@centsideas/enums';

import env from './environment';
import { ReviewsRoutes } from './reviews.routes';
import { IdeasRoutes } from './ideas.routes';
import { UsersRoutes } from './users.routes';
import { authMiddleware } from './auth.middleware';
import { corsMiddleware } from './cors.middleware';

@injectable()
export class GatewayServer {
  private app = express();

  constructor(
    private ideasRoutes: IdeasRoutes,
    private usersRoutes: UsersRoutes,
    private reviewsRoutes: ReviewsRoutes,
  ) {}

  start = () => {
    Logger.log('launch', env.environment);

    this.app.use(corsMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    // FIXME does this middleware hurt performance? if it has a big impact we could just use the middleware on the routes where it is really necessary
    this.app.use(authMiddleware);

    this.app.use(
      `/${ApiEndpoints.Ideas}`,
      this.ideasRoutes.setup(env.hosts.ideas, env.hosts.consumer),
    );
    this.app.use(`/${ApiEndpoints.Reviews}`, this.reviewsRoutes.setup(env.hosts.reviews));
    this.app.use(
      `/${ApiEndpoints.Users}`,
      this.usersRoutes.setup(env.hosts.users, env.hosts.consumer),
    );

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => res.status(200).send('gateway alive'));
    this.app.get(`**`, (_req, res) => res.status(200).send(`centsideas gateway 404`));
    this.app.listen(env.port);
  };
}
