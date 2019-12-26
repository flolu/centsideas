import { injectable } from 'inversify';
import * as express from 'express';

import { ReviewsApiRoutes } from '@cents-ideas/enums';

import { ExpressAdapter } from './express-adapter';

@injectable()
export class ReviewsRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string): express.Router => {
    this.router.post(``, this.expressAdapter.makeJsonAdapter(`${host}/${ReviewsApiRoutes.Create}`));
    this.router.put(
      `/:id/${ReviewsApiRoutes.SaveDraft}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ReviewsApiRoutes.SaveDraft}`),
    );
    this.router.put(
      `/:id/${ReviewsApiRoutes.Update}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ReviewsApiRoutes.Update}`),
    );
    this.router.put(
      `/:id/${ReviewsApiRoutes.Publish}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ReviewsApiRoutes.Publish}`),
    );

    return this.router;
  };
}
