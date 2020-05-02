import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { Logger, getContainer } from '@centsideas/utils';

import { GatewayMiddlewares } from './gateway.middlewares';
import { GatewayEnvironment } from './gateway.environment';

@injectable()
export class GatewayServer {
  private server = new InversifyExpressServer(getContainer());

  constructor(private middlewares: GatewayMiddlewares, private env: GatewayEnvironment) {
    this.server.setConfig((app: express.Application) => {
      Logger.info('launch in', this.env.environment, 'mode');

      app.use(this.middlewares.cors);
      app.use(helmet());
      app.use(bodyParser.json());
      app.use(cookieParser());
      // FIXME does this middleware hurt performance? if it has a big impact we could just use the middleware on the routes where it is really necessary
      app.use(this.middlewares.auth);
    });

    this.server.build().listen(this.env.port);
  }
}
