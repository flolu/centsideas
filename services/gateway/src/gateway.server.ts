import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { injectable } from 'inversify';

import { IServer } from '@cents-ideas/models';
import { Logger } from '@cents-ideas/utils';

import { IGatewayEnvironment } from './environment';
import { ExpressAdapter } from './express-adapter';

@injectable()
export class GatewayServer implements IServer {
  private app = express();

  constructor(private logger: Logger, private expressAdapter: ExpressAdapter) {}

  start = (env: IGatewayEnvironment) => {
    this.logger.debug('initialized with env: ', env);
    const { port } = env;
    const ideasApiRoot = env.api.ideas.root;
    const reviewsApiRoot = env.api.ideas.root;
    const ideasHost = env.hosts.ideas;
    const consumerHost = env.hosts.consumer;

    this.app.use(bodyParser.json());
    this.app.use(cors());

    this.app.get(`${ideasApiRoot}`, this.expressAdapter.makeJsonAdapter(`${consumerHost}/ideas/get-all`));
    this.app.get(`${ideasApiRoot}/:id`, this.expressAdapter.makeJsonAdapter(`${consumerHost}/ideas/get-by-id`));

    this.app.get('/alive', (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('gateway listening on internal port', port));
  };
}
