import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { ApiEndpoints, EventTopics, IdeasApiRoutes } from '@cents-ideas/enums';

import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';
import env from './environment';

@injectable()
export class ConsumerServer {
  private app = express();

  constructor(
    private logger: Logger,
    private messageBroker: MessageBroker,
    private expressAdapter: ExpressAdapter,
    private queryService: QueryService,
    private ideasProjection: IdeasProjection,
    private reviewsProjection: ReviewsProjection,
  ) {}

  start = () => {
    this.logger.debug('initialized with env: ', env);

    this.messageBroker.initialize({ brokers: env.kafka.brokers });
    this.messageBroker.subscribe(EventTopics.Ideas, this.ideasProjection.handleEvent);
    this.messageBroker.subscribe(EventTopics.Reviews, this.reviewsProjection.handleEvent);
    // TODO users projection
    // TODO maybe separate out reviews projection (currently there is a reviews array on ideas)

    this.app.use(bodyParser.json());

    this.app.post(
      `/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetAll}`,
      this.expressAdapter.json(this.queryService.getAllIdeas),
    );
    this.app.post(
      `/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetById}`,
      this.expressAdapter.json(this.queryService.getIdeaById),
    );

    this.app.get('/alive', (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(env.port, () => this.logger.info('consumer service listening on internal port', env.port));
  };
}
