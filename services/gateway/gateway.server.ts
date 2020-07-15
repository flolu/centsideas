import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import {injectable} from 'inversify';
import {InversifyExpressServer} from 'inversify-express-utils';

import {RpcStatusHttpMap} from '@centsideas/rpc';
import {Environments} from '@centsideas/enums';
import {DI} from '@centsideas/dependency-injection';
import {GlobalConfig} from '@centsideas/config';
import {ServiceServer} from '@centsideas/utils';

import {GatewayConfig} from './gateway.config';

@injectable()
export class GatewayServer extends ServiceServer {
  // FIXME eventually add frontend to cors whitelist
  private corsWhitelist: string[] = [];

  constructor(private globalConfig: GlobalConfig, private config: GatewayConfig) {
    super(3001);
    const server = new InversifyExpressServer(DI.getContainer());
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

          const message = err.details || err.message;
          const httpCode = RpcStatusHttpMap[err.code] || 500;
          const name = err.metadata?.get('name')[0] || err.name || '';
          const unexpected = httpCode >= 500 ? true : false;

          res.status(httpCode).json({message, unexpected, name});
        },
      );
    });
    server.build().listen(this.config.get('gateway.port'));
  }

  private isOriginAllowed = (origin: string | undefined) => {
    if (this.globalConfig.get('global.environment') === Environments.Dev) return true;
    if (origin && this.corsWhitelist.includes(origin)) return true;
    if (origin === undefined) return true;

    return false;
  };

  async healthcheck() {
    return true;
  }
  async shutdownHandler() {
    //
  }
}
