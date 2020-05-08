import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { RpcStatusHttpMap } from '@centsideas/rpc';
import { Logger } from '@centsideas/utils';
import { Environments } from '@centsideas/enums';
import { GlobalEnvironment } from '@centsideas/environment';
import { DependencyInjection } from '@centsideas/dependency-injection';

import { GatewayEnvironment } from './gateway.environment';

@injectable()
export class GatewayServer {
  constructor(
    private globalEnv: GlobalEnvironment,
    private env: GatewayEnvironment,
    private logger: Logger,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    const server = new InversifyExpressServer(DependencyInjection.getContainer());
    server.setConfig((app: express.Application) => {
      app.use(helmet());
      app.use(
        cors({
          origin: (origin, callback) =>
            this.isOriginAllowed(origin)
              ? callback(null, true)
              : callback(Error('not allowed by cors'), false),
          credentials: true,
        }),
      );
      app.use(bodyParser.json());
      app.use(cookieParser());
    });

    server.setErrorConfig(app => {
      app.use(
        (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
          if (!err) return res.status(500);
          if (!err.code) return res.status(500);

          const message = err.details;
          const httpCode = RpcStatusHttpMap[err.code] || 500;
          const name = err.metadata?.get('name')[0] || '';
          const unexpected = httpCode >= 500 ? true : false;

          res.status(httpCode).json({ message, unexpected, name });
        },
      );
    });
    server.build().listen(this.env.port);
  }

  private isOriginAllowed = (origin: string | undefined) => {
    if (this.globalEnv.environment === Environments.Dev) return true;
    if (origin && this.env.corsWhitelist.includes(origin)) return true;
    if (origin === undefined) return true;

    return false;
  };
}
