import * as express from 'express';
import * as path from 'path';
import { interfaces, controller, httpGet } from 'inversify-express-utils';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { ApiEndpoints, UsersApiRoutes } from '@centsideas/enums';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import { IIdeaQueries } from '@centsideas/rpc';

// TODO input and return types
// TODO use grpc to communicate with other services

@controller('')
export class QueryController implements interfaces.Controller {
  private readonly protoRootPath = path.resolve(__dirname, '../../', 'packages', 'rpc');
  private readonly ideaQueriesProto = path.join(this.protoRootPath, 'idea', 'idea-queries.proto');
  private ideasClient: IIdeaQueries;

  constructor(private expressAdapter: ExpressAdapter, private env: GatewayEnvironment) {
    const packageDef = protoLoader.loadSync(this.ideaQueriesProto);
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideasPackage = grpcObject.ideaQueries;
    this.ideasClient = new (ideasPackage as any).IdeaQueries(
      `${this.env.consumerRpcHost}:${this.env.consumerRpcPort}`,
      grpc.credentials.createInsecure(),
    );
  }

  @httpGet(`/${ApiEndpoints.Ideas}`)
  getIdeas() {
    return new Promise(resolve => {
      this.ideasClient.getAll(undefined, (err, response) => {
        if (err) throw err;
        if (!response) return resolve([]);
        resolve(response.ideas || []);
      });
    });
  }

  @httpGet(`/${ApiEndpoints.Ideas}/:id`)
  getIdeaById(req: express.Request) {
    return new Promise(resolve => {
      this.ideasClient.getById({ id: req.params.id }, (err, response) => {
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
