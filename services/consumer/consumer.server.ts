import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger, ExpressAdapters } from '@centsideas/utils';
import { ApiEndpoints, EventTopics, IdeasApiRoutes, UsersApiRoutes } from '@centsideas/enums';

import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';
import { ConsumerEnvironment } from './consumer.environment';
import { UsersProjection } from './users.projection';

@injectable()
export class ConsumerServer {
  private app = express();

  constructor(
    private messageBroker: MessageBroker,
    private queryService: QueryService,
    private ideasProjection: IdeasProjection,
    private reviewsProjection: ReviewsProjection,
    private usersProjection: UsersProjection,
    private env: ConsumerEnvironment,
  ) {
    Logger.log('launch', this.env.environment);

    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.subscribe(EventTopics.Ideas, this.ideasProjection.handleEvent);
    this.messageBroker.subscribe(EventTopics.Reviews, this.reviewsProjection.handleEvent);
    this.messageBroker.subscribe(EventTopics.Users, this.usersProjection.handleEvent);

    this.app.use(bodyParser.json());

    this.registerQueryRoutes();

    this.app.get('/alive', (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  }

  private registerQueryRoutes() {
    this.app.post(
      `/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetAll}`,
      ExpressAdapters.json(this.queryService.getAllIdeas),
    );
    this.app.post(
      `/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetById}`,
      ExpressAdapters.json(this.queryService.getIdeaById),
    );

    this.app.post(
      `/${ApiEndpoints.Users}/${UsersApiRoutes.GetById}`,
      ExpressAdapters.json(this.queryService.getUserById),
    );
    this.app.post(
      `/${ApiEndpoints.Users}/${UsersApiRoutes.GetAll}`,
      ExpressAdapters.json(this.queryService.getAllUsers),
    );
  }
}
