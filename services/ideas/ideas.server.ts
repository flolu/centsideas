import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IdeasApiRoutes } from '@centsideas/enums';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

import { Logger, ExpressAdapters } from '@centsideas/utils';
import { HttpRequest } from '@centsideas/models';
import { IdeasService } from './ideas.service';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeasServer {
  private app = express();

  constructor(private ideasService: IdeasService, private env: IdeasEnvironment) {
    // TODO implement nicely
    const server = new grpc.Server();
    const packageDef = protoLoader.loadSync(
      path.join(__dirname, '../../packages/protobuf', 'idea.proto'),
      {},
    );

    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideaPackage = grpcObject.ideaPackage;

    server.bindAsync(
      `${this.env.rpc.host}:${this.env.rpc.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) Logger.error(err, 'while binding server');
        else Logger.info('proto server running ', port);
        server.addService((ideaPackage as any).Idea.service, {
          createIdea: async (call: any, callback: any) => {
            Logger.info('got request', call.request);

            const httpRequest: HttpRequest = {
              body: { title: call.request.title, description: call.request.description },
              ip: '',
              method: '',
              path: '',
              url: '',
              cookies: null,
              params: null,
              query: null,
              headers: null,
              locals: { userId: call.request.userId },
            };
            const response = await this.ideasService.create(httpRequest);

            callback(null, response.body);
          },
        });
        server.start();
      },
    );

    Logger.info('launch in', this.env.environment, 'mode');
    this.app.use(bodyParser.json());

    this.app.post(`/${IdeasApiRoutes.Create}`, ExpressAdapters.json(this.ideasService.create));
    this.app.post(`/${IdeasApiRoutes.Update}`, ExpressAdapters.json(this.ideasService.update));
    this.app.post(`/${IdeasApiRoutes.Delete}`, ExpressAdapters.json(this.ideasService.delete));

    this.app.get(`/${IdeasApiRoutes.Alive}`, (_req, res) => res.status(200).send());

    this.app.listen(this.env.port);
  }
}
