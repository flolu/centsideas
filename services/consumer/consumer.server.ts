import { injectable } from 'inversify';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger, ExpressAdapters } from '@centsideas/utils';
import { ApiEndpoints, EventTopics, UsersApiRoutes } from '@centsideas/enums';

import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';
import { ConsumerEnvironment } from './consumer.environment';
import { UsersProjection } from './users.projection';
import { IIdeaQueriesImplementation } from '@centsideas/protobuf';

@injectable()
export class ConsumerServer {
  private readonly protoRootPath = path.resolve(__dirname, '../../', 'packages', 'protobuf');
  private readonly ideaQueriesProto = path.join(this.protoRootPath, 'idea', 'idea-queries.proto');

  // TODO remove
  private app = express();

  constructor(
    private messageBroker: MessageBroker,
    private queryService: QueryService,
    private ideasProjection: IdeasProjection,
    private reviewsProjection: ReviewsProjection,
    private usersProjection: UsersProjection,
    private env: ConsumerEnvironment,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');

    this.messageBroker.events(EventTopics.Ideas).subscribe(this.ideasProjection.handleEvent);
    this.messageBroker.events(EventTopics.Reviews).subscribe(this.reviewsProjection.handleEvent);
    this.messageBroker.events(EventTopics.Users).subscribe(this.usersProjection.handleEvent);

    const packageDef = protoLoader.loadSync(this.ideaQueriesProto);
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideaQueries = grpcObject.ideaQueries;
    const server = new grpc.Server();

    server.addService((ideaQueries as any).IdeaQueries.service, this.ideasImplementation as any);
    server.bindAsync(
      `${this.env.rpc.host}:${this.env.rpc.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) Logger.error(err, 'while binding server');
        else Logger.info('proto server running ', port);

        server.start();
      },
    );

    this.app.use(bodyParser.json());

    this.registerQueryRoutes();

    // TODO should only be healthy if connected to kafka and proto servers are running
    this.app.get('/alive', (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  }

  private registerQueryRoutes() {
    this.app.post(
      `/${ApiEndpoints.Users}/${UsersApiRoutes.GetById}`,
      ExpressAdapters.json(this.queryService.getUserById),
    );
    this.app.post(
      `/${ApiEndpoints.Users}/${UsersApiRoutes.GetAll}`,
      ExpressAdapters.json(this.queryService.getAllUsers),
    );
  }

  private ideasImplementation: IIdeaQueriesImplementation = {
    getAll: async (_call, callback) => {
      const ideas = await this.queryService.getAllIdeas();
      callback(null, { ideas });
    },
    getById: async (call, callback) => {
      if (!call.request) return callback(Error('no payload sent'), null);
      const idea = await this.queryService.getIdeaById(call.request?.id);
      callback(null, idea);
    },
  };
}
