import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { Logger, getContainer } from '@centsideas/utils';
import { Environments } from '@centsideas/enums';

import { GatewayEnvironment } from './gateway.environment';
import { GlobalEnvironment } from '@centsideas/environment';

@injectable()
export class GatewayServer {
  constructor(private globalEnv: GlobalEnvironment, private env: GatewayEnvironment) {
    Logger.info('launch in', this.globalEnv.environment, 'mode');

    const server = new InversifyExpressServer(getContainer());
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

    // TODO https://github.com/inversify/inversify-express-utils#seterrorconfigerrorconfigfn
    server.build().listen(this.env.port);
  }

  private isOriginAllowed = (origin: string | undefined) => {
    // TODO why is origin undefined sometimes? should it be blocked?
    if (origin === undefined) return true;

    if (this.globalEnv.environment === Environments.Dev) return true;
    if (this.env.corsWhitelist.includes(origin)) return true;

    return false;
  };
}
