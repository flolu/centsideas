import * as express from 'express';
import { inject } from 'inversify';
import { interfaces, controller, httpGet } from 'inversify-express-utils';

import { ApiEndpoints, UsersApiRoutes } from '@centsideas/enums';
import { IIdeaQueries, RpcClient } from '@centsideas/rpc';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import TYPES from './types';

// TODO input and return types
// TODO use only grpc to communicate with other services

@controller('')
export class QueryController implements interfaces.Controller {
  constructor(
    private expressAdapter: ExpressAdapter,
    private env: GatewayEnvironment,
    @inject(TYPES.IDEAS_QUERY_RPC_CLIENT) private ideasRpc: RpcClient<IIdeaQueries>,
  ) {}

  @httpGet(`/${ApiEndpoints.Ideas}`)
  getIdeas() {
    return new Promise(resolve => {
      this.ideasRpc.client.getAll(undefined, (err, response) => {
        if (err) throw err;
        if (!response) return resolve([]);
        resolve(response.ideas || []);
      });
    });
  }

  @httpGet(`/${ApiEndpoints.Ideas}/:id`)
  getIdeaById(req: express.Request) {
    return new Promise(resolve => {
      this.ideasRpc.client.getById({ id: req.params.id }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpGet(`/${ApiEndpoints.Users}`)
  getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.consumerHost}/${ApiEndpoints.Users}/${UsersApiRoutes.GetAll}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Users}/:id`)
  getUserById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.consumerHost}/${ApiEndpoints.Users}/${UsersApiRoutes.GetById}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Alive}`)
  alive() {
    return 'gateway is alive';
  }
}
