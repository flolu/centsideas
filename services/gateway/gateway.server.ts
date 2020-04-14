import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';

import { Logger } from '@cents-ideas/utils';
import { ApiEndpoints, HeaderKeys, CentsCommandments } from '@cents-ideas/enums';
import { ITokenDataFull, IAuthTokenPayload } from '@cents-ideas/models';

import env from './environment';
import { ReviewsRoutes } from './reviews.routes';
import { IdeasRoutes } from './ideas.routes';
import { UsersRoutes } from './users.routes';

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

    // TODO laod url from env
    this.app.use(cors({ origin: 'http://localhost:5432', credentials: true }));
    this.app.use(bodyParser());
    this.app.use(cookieParser());

    this.app.use((req, res, next) => {
      res.locals.userId = null;

      const token = req.headers[HeaderKeys.Auth];

      // TODO read token from cookies
      if (!token) return next();

      // FIXME performance could be improved by only doing this on routes that require auth
      try {
        const decoded = jwt.verify(token, env.jwtSecret);
        const data: ITokenDataFull = decoded as any;

        if (data.type === 'auth') {
          const payload: IAuthTokenPayload = data.payload as any;
          res.locals.userId = payload.userId;
        }
        // tslint:disable-next-line:no-empty
      } catch (err) {}

      Logger.debug(
        `request was made by ${res.locals.userId ? res.locals.userId : 'a not authenticated user'}`,
      );
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
