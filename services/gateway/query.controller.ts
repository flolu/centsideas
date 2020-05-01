import * as express from 'express';
import { interfaces, controller, httpGet } from 'inversify-express-utils';

import { ApiEndpoints, IdeasApiRoutes, UsersApiRoutes } from '@centsideas/enums';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';

// TODO input and return types
// TODO use grpc to communicate with other services

@controller('')
export class QueryController implements interfaces.Controller {
  constructor(private expressAdapter: ExpressAdapter, private env: GatewayEnvironment) {}

  @httpGet(`/${ApiEndpoints.Ideas}`)
  getIdea(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetAll}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Ideas}/:id`)
  getIdeaById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetById}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
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
