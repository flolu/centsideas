import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { IServer } from '@cents-ideas/models';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { IdeasApiInternalRoutes, ApiEndpoints, EventTopics } from '@cents-ideas/enums';

import { IConsumerEnvironment } from './environment';
import { QueryService } from './query.service';
import { IdeasProjection } from './ideas.projection';
import { ReviewsProjection } from './reviews.projection';

@injectable()
export class ConsumerServer implements IServer {
  private env!: IConsumerEnvironment;
  private app = express();

  constructor(
    private logger: Logger,
    private messageBroker: MessageBroker,
    private expressAdapter: ExpressAdapter,
    private queryService: QueryService,
    private ideasProjection: IdeasProjection,
    private reviewsProjection: ReviewsProjection,
  ) {}

  start = (env: IConsumerEnvironment) => {
    this.logger.debug('initialized with env: ', env);
    this.env = env;

    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.subscribe(EventTopics.Ideas, this.ideasProjection.handleEvent);
    this.messageBroker.subscribe(EventTopics.Reviews, this.reviewsProjection.handleEvent);

    this.app.use(bodyParser.json());

    this.app.post(
      `/${ApiEndpoints.Ideas}/${IdeasApiInternalRoutes.GetAll}`,
      this.expressAdapter.json(this.queryService.getAllIdeas),
    );
    this.app.post(
      `/${ApiEndpoints.Ideas}/${IdeasApiInternalRoutes.GetById}`,
      this.expressAdapter.json(this.queryService.getIdeaById),
    );

    this.app.get('/alive', (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(this.env.port, () =>
      this.logger.info('consumer service listening on internal port', this.env.port),
    );
  };
}
