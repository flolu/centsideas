import { injectable } from 'inversify';
import * as express from 'express';

import { IdeasApiRoutes, ApiEndpoints } from '@cents-ideas/enums';

import { ExpressAdapter } from './express-adapter';

@injectable()
export class IdeasRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string, consumerHost: string): express.Router => {
    this.router.get(
      ``,
      this.expressAdapter.makeJsonAdapter(
        `${consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetAll}`,
      ),
    );
    this.router.get(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerHost}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetById}`,
      ),
    );

    this.router.post(``, this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiRoutes.Create}`));
    this.router.put(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiRoutes.Update}`),
    );
    this.router.delete(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(`${host}/${IdeasApiRoutes.Delete}`),
    );

    return this.router;
  };
}
