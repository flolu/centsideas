import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { IServer } from '@cents-ideas/models';

import { IIdeasServiceEnvironment } from './environment';
import { ReviewsService } from './reviews.service';

@injectable()
export class ReviewsServer implements IServer {
  private app = express();

  constructor(private logger: Logger, private reviewsService: ReviewsService, private expressAdapter: ExpressAdapter) {}

  start = (env: IIdeasServiceEnvironment) => {
    this.logger.debug('initialized with env: ', env);
    const { port } = env;

    this.app.use(bodyParser.json());

    this.app.post('/create', this.expressAdapter.json(this.reviewsService.createEmptyReview));
    this.app.post('/save-draft', this.expressAdapter.json(this.reviewsService.saveDraft));
    /*this.app.post('/publish', this.expressAdapter.json(this.reviewsService.publish));
    this.app.post('/update', this.expressAdapter.json(this.reviewsService.update));
    this.app.post('/unpublish', this.expressAdapter.json(this.reviewsService.unpublish)); */

    this.app.get('/alive', (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('reviews service listening on internal port', port));
  };
}
