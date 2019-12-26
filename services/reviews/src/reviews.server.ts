import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { ReviewsApiInternalRoutes } from '@cents-ideas/enums';

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

    this.app.post(
      `/${ReviewsApiInternalRoutes.Create}`,
      this.expressAdapter.json(this.reviewsService.createEmptyReview),
    );
    this.app.post(`/${ReviewsApiInternalRoutes.SaveDraft}`, this.expressAdapter.json(this.reviewsService.saveDraft));
    this.app.post(`/${ReviewsApiInternalRoutes.Publish}`, this.expressAdapter.json(this.reviewsService.publish));
    this.app.post(`/${ReviewsApiInternalRoutes.Update}`, this.expressAdapter.json(this.reviewsService.update));
    this.app.post(`/${ReviewsApiInternalRoutes.Unpublish}`, this.expressAdapter.json(this.reviewsService.unpublish));

    this.app.get('/alive', (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('reviews service listening on internal port', port));
  };
}
