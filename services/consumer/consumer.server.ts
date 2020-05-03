import * as http from 'http';
import { injectable } from 'inversify';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger } from '@centsideas/utils';
import { EventTopics } from '@centsideas/enums';

import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';
import { ConsumerEnvironment } from './consumer.environment';
import { UsersProjection } from './users.projection';
import { RpcServer, IIdeaQueries, GetAllIdeas, GetIdeaById } from '@centsideas/rpc';

@injectable()
export class ConsumerServer {
  constructor(
    private messageBroker: MessageBroker,
    private queryService: QueryService,
    private ideasProjection: IdeasProjection,
    private reviewsProjection: ReviewsProjection,
    private usersProjection: UsersProjection,
    private env: ConsumerEnvironment,
    private rpcServer: RpcServer,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');
    // TODO also consider kafka connection in health checks
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    this.messageBroker.events(EventTopics.Ideas).subscribe(this.ideasProjection.handleEvent);
    this.messageBroker.events(EventTopics.Reviews).subscribe(this.reviewsProjection.handleEvent);
    this.messageBroker.events(EventTopics.Users).subscribe(this.usersProjection.handleEvent);

    const ideaService = this.rpcServer.loadService('idea', 'IdeaQueries');
    this.rpcServer.addService<IIdeaQueries>(ideaService, {
      getAll: this.getAll,
      getById: this.getById,
    });
  }

  getAll: GetAllIdeas = async () => {
    const ideas = await this.queryService.getAllIdeas();
    return { ideas };
  };

  getById: GetIdeaById = async ({ id }) => {
    return this.queryService.getIdeaById(id);
  };
}
