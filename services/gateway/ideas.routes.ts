import { injectable } from 'inversify';
import * as express from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

import { IdeasApiRoutes, ApiEndpoints } from '@centsideas/enums';

import { ExpressAdapter } from './express-adapter';
import { Logger, getProvider } from '@centsideas/utils';
import { GatewayEnvironment } from './gateway.environment';

@injectable()
export class IdeasRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter, private env: GatewayEnvironment) {}

  setup = (host: string, consumerHost: string): express.Router => {
    const url = `http://${host}`;
    const consumerUrl = `http://${consumerHost}`;

    // TOOD implement nicely
    const packageDef = protoLoader.loadSync(
      path.join(__dirname, '../../packages/protobuf', 'idea.proto'),
      {},
    );
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideaPackage = grpcObject.ideaPackage;

    const client = new (ideaPackage as any).Idea(
      `${this.env.ideasRpcHost}:${this.env.ideasRpcPort}`,
      grpc.credentials.createInsecure(),
    );

    this.router.post('', (req, res) => {
      Logger.info('create idea', req.body);

      client.createIdea(
        { title: req.body.title, description: req.body.description, userId: res.locals.userId },
        (err: any, response: any) => {
          if (err) Logger.error(err, 'while creating idea proto client request');
          Logger.info('create idea proto response', response);
          res.json(response);
        },
      );
    });

    this.router.get(
      ``,
      this.expressAdapter.makeJsonAdapter(
        `${consumerUrl}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetAll}`,
      ),
    );
    this.router.get(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerUrl}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetById}`,
      ),
    );

    // this.router.post(``, this.expressAdapter.makeJsonAdapter(`${url}/${IdeasApiRoutes.Create}`));

    this.router.put(`/:id`, this.expressAdapter.makeJsonAdapter(`${url}/${IdeasApiRoutes.Update}`));
    this.router.delete(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(`${url}/${IdeasApiRoutes.Delete}`),
    );

    return this.router;
  };
}
