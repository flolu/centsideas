import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { IServer } from '@cents-ideas/models';
import { MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger, ExpressAdapter } from '@cents-ideas/utils';

import { IConsumerEnvironment } from './environment';
import { QueryService } from './query.service';
import { IdeasProjection } from './ideas-projection';

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
  ) {}

  start = (env: IConsumerEnvironment) => {
    this.env = env;

    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.subscribe('ideas', this.ideasProjection.handleEvent);

    this.app.use(bodyParser.json());

    this.app.post('/ideas/get-all', this.expressAdapter.json(this.queryService.getAllIdeas));
    this.app.post('/ideas/get-by-id', this.expressAdapter.json(this.queryService.getIdeaById));

    this.app.listen(this.env.port, () =>
      this.logger.info('consumer service listening on internal port', this.env.port),
    );
  };
}
