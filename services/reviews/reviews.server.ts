import * as http from 'http';
import { injectable } from 'inversify';

import { Logger, ExpressAdapters } from '@centsideas/utils';
import { ReviewsApiRoutes } from '@centsideas/enums';

import { ReviewsService } from './reviews.service';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewsServer {
  constructor(private reviewsService: ReviewsService, private env: ReviewsEnvironment) {
    Logger.info('launch in', this.env.environment, 'mode');
    // TODO setup reviews rpc server
    http.createServer((_, res) => res.writeHead(true ? 200 : 500).end()).listen(3000);
    /* 
    this.app.post(`/${ReviewsApiRoutes.Create}`, ExpressAdapters.json(this.reviewsService.create));
    this.app.post(`/${ReviewsApiRoutes.Update}`, ExpressAdapters.json(this.reviewsService.update));
    this.app.post(`/${ReviewsApiRoutes.Delete}`, ExpressAdapters.json(this.reviewsService.delete)); */
  }
}
