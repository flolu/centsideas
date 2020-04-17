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

  constructor(private reviewsService: ReviewsService, private expressAdapter: ExpressAdapter) {}

  start = () => {
    Logger.debug('initialized with env: ', env);
    const { port } = env;

    this.app.use(bodyParser.json());

    this.app.post(
      `/${ReviewsApiRoutes.Create}`,
      this.expressAdapter.json(this.reviewsService.create),
    );
    this.app.post(
      `/${ReviewsApiRoutes.Update}`,
      this.expressAdapter.json(this.reviewsService.update),
    );
    this.app.post(
      `/${ReviewsApiRoutes.Delete}`,
      this.expressAdapter.json(this.reviewsService.delete),
    );

    this.app.get('/alive', (_req, res) => res.status(200).send());

    this.app.listen(port, () => Logger.debug('reviews service listening on internal port', port));
  };
}
