import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';

import { Logger } from '@cents-ideas/utils';
import { ApiEndpoints, HeaderKeys } from '@cents-ideas/enums';
import { IAuthTokenData } from '@cents-ideas/models';

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

    this.app.use((req, res, next) => {
      let decoded: any;
      const token: string = req.headers[HeaderKeys.Auth] || '';
      try {
        decoded = jwt.verify(token, env.jwtSecret);
        const payload: IAuthTokenData = { userId: decoded.userId };
        res.locals.userId = payload.userId;
        this.logger.debug(`found valid auth token (${payload.userId} is authenticated)`);
      } catch (err) {
        res.locals.userId = null;
        this.logger.debug(`found no valid auth token (user is not authenticated)`);
      }
      next();
    });

    this.app.use(`/${ApiEndpoints.Ideas}`, this.ideasRoutes.setup(env.hosts.ideas, env.hosts.consumer));
    this.app.use(`/${ApiEndpoints.Reviews}`, this.reviewsRoutes.setup(env.hosts.reviews));
    this.app.use(`/${ApiEndpoints.Users}`, this.usersRoutes.setup(env.hosts.users));

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => {
      return res.status(200).send('gateway alive');
    });

    this.app.listen(env.port, () => this.logger.info('gateway listening on internal port', env.port));
  };
}
