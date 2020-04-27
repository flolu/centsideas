import { injectable } from 'inversify';
import * as express from 'express';

import { ReviewsApiRoutes } from '@centsideas/enums';

import { ExpressAdapter } from './express-adapter';

@injectable()
export class ReviewsRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string): express.Router => {
    const url = `http://${host}`;

    this.router.post(``, this.expressAdapter.makeJsonAdapter(`${url}/${ReviewsApiRoutes.Create}`));
    this.router.put(
      `/:id/${ReviewsApiRoutes.Update}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${ReviewsApiRoutes.Update}`),
    );
    this.router.delete(
      `/:id/${ReviewsApiRoutes.Delete}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${ReviewsApiRoutes.Delete}`),
    );

    return this.router;
  };
}
