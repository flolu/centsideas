import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { injectable } from 'inversify';

import { Logger } from '@cents-ideas/utils';
import { ApiEndpoints } from '@cents-ideas/enums';

import env from './environment';
import { ReviewsRoutes } from './reviews.routes';
import { IdeasRoutes } from './ideas.routes';
import { UsersRoutes } from './users.routes';

@injectable()
export class GatewayServer {
  private app = express();

  constructor(
    private logger: Logger,
    private ideasRoutes: IdeasRoutes,
    private reviewsRoutes: ReviewsRoutes,
    private usersRoutes: UsersRoutes,
  ) {}

  start = () => {
    this.logger.debug('initialized with env: ', env);

    this.app.use(bodyParser.json());
    this.app.use(cors());

    // TODO fix all http request types https://stackoverflow.com/a/612035/8586803
    this.app.use(`/${ApiEndpoints.Ideas}`, this.ideasRoutes.setup(env.hosts.ideas, env.hosts.consumer));
    this.app.use(`/${ApiEndpoints.Reviews}`, this.reviewsRoutes.setup(env.hosts.reviews));
    this.app.use(`/${ApiEndpoints.Users}`, this.usersRoutes.setup(env.hosts.users));

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(env.port, () => this.logger.info('gateway listening on internal port', env.port));
  };
}
