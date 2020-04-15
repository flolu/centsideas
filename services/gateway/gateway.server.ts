import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';

import { Logger } from '@cents-ideas/utils';
import { ApiEndpoints, HeaderKeys, CentsCommandments } from '@cents-ideas/enums';

import env from './environment';
import { ReviewsRoutes } from './reviews.routes';
import { IdeasRoutes } from './ideas.routes';
import { UsersRoutes } from './users.routes';
import { IAccessTokenPayload } from '@cents-ideas/models';

@injectable()
export class GatewayServer {
  private app = express();

  constructor(
    private ideasRoutes: IdeasRoutes,
    private usersRoutes: UsersRoutes,
    private reviewsRoutes: ReviewsRoutes,
  ) {}

  start = () => {
    Logger.debug('initialized with env: ', env);

    let whitelist = [env.frontendUrl];
    if (env.environment === 'dev')
      whitelist = [...whitelist, 'http://localhost:4000', 'http://localhost:5432'];
    const checkOrigin = (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || whitelist.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    };
    this.app.use(cors({ origin: checkOrigin, credentials: true }));
    this.app.use(bodyParser());
    this.app.use(cookieParser());

    // TODO move this middleware to utils and only use it on necessary routes?
    this.app.use((req, res, next) => {
      res.locals.userId = null;
      const authHeader = req.headers[HeaderKeys.Auth];
      if (!authHeader) return next();

      try {
        const accessToken = (authHeader as string).split(' ')[1];
        const decoded = jwt.verify(accessToken, env.accessTokenSecret);
        const data: IAccessTokenPayload = decoded as any;
        res.locals.userId = data.userId;
        // tslint:disable-next-line:no-empty
      } catch (error) {}

      /* Logger.debug(
        `request was made by ${res.locals.userId ? res.locals.userId : 'a not authenticated user'}`,
      ); */
      next();
    });

    this.app.use(
      `/${ApiEndpoints.Ideas}`,
      this.ideasRoutes.setup(env.hosts.ideas, env.hosts.consumer),
    );
    this.app.use(`/${ApiEndpoints.Reviews}`, this.reviewsRoutes.setup(env.hosts.reviews));
    this.app.use(
      `/${ApiEndpoints.Users}`,
      this.usersRoutes.setup(env.hosts.users, env.hosts.consumer),
    );

    this.app.get(`/${ApiEndpoints.Alive}`, (_req, res) => {
      return res.status(200).send('gateway alive');
    });

    this.app.get(`**`, (req, res) => {
      return res.status(200).send(`hello ${req.ip}, greetings from cents-ideas gateway`);
    });

    this.app.listen(env.port, () =>
      Logger.debug(
        'gateway listening on internal port',
        env.port,
        CentsCommandments.Control,
        CentsCommandments.Entry,
        CentsCommandments.Need,
        CentsCommandments.Time,
        CentsCommandments.Scale,
      ),
    );
  };
}
