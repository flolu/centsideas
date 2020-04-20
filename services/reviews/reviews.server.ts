import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters } from '@centsideas/utils';
import { ReviewsApiRoutes } from '@centsideas/enums';

import { ReviewsService } from './reviews.service';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewsServer {
  private app = express();

  constructor(private reviewsService: ReviewsService, private env: ReviewsEnvironment) {}

  start = () => {
    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(`/${ReviewsApiRoutes.Create}`, ExpressAdapters.json(this.reviewsService.create));
    this.app.post(`/${ReviewsApiRoutes.Update}`, ExpressAdapters.json(this.reviewsService.update));
    this.app.post(`/${ReviewsApiRoutes.Delete}`, ExpressAdapters.json(this.reviewsService.delete));

    this.app.get('/alive', (_req, res) => res.status(200).send());

    this.app.listen(this.env.port);
  };
}
