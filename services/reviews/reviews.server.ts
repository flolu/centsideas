import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { ReviewsApiRoutes } from '@cents-ideas/enums';

import { ReviewsService } from './reviews.service';
import env from './environment';

@injectable()
export class ReviewsServer {
  private app = express();

  constructor(private logger: Logger, private reviewsService: ReviewsService, private expressAdapter: ExpressAdapter) {}

  start = () => {
    this.logger.debug('initialized with env: ', env);
    const { port } = env;

    this.app.use(bodyParser.json());

    this.app.post(`/${ReviewsApiRoutes.Create}`, this.expressAdapter.json(this.reviewsService.createEmptyReview));
    this.app.post(`/${ReviewsApiRoutes.SaveDraft}`, this.expressAdapter.json(this.reviewsService.saveDraft));
    this.app.post(`/${ReviewsApiRoutes.Publish}`, this.expressAdapter.json(this.reviewsService.publish));
    this.app.post(`/${ReviewsApiRoutes.Update}`, this.expressAdapter.json(this.reviewsService.update));
    this.app.post(`/${ReviewsApiRoutes.Unpublish}`, this.expressAdapter.json(this.reviewsService.unpublish));

    this.app.get('/alive', (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('reviews service listening on internal port', port));
  };
}
