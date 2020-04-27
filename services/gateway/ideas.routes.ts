import { injectable } from 'inversify';
import * as express from 'express';

import { IdeasApiRoutes, ApiEndpoints } from '@centsideas/enums';

import { ExpressAdapter } from './express-adapter';

@injectable()
export class IdeasRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string, consumerHost: string): express.Router => {
    const url = `http://${host}`;
    const consumerUrl = `http://${consumerHost}`;

    this.router.get(
      ``,
      this.expressAdapter.makeJsonAdapter(
        `${consumerUrl}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetAll}`,
      ),
    );
    this.router.get(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerUrl}/${ApiEndpoints.Ideas}/${IdeasApiRoutes.GetById}`,
      ),
    );

    this.router.post(``, this.expressAdapter.makeJsonAdapter(`${url}/${IdeasApiRoutes.Create}`));
    this.router.put(`/:id`, this.expressAdapter.makeJsonAdapter(`${url}/${IdeasApiRoutes.Update}`));
    this.router.delete(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(`${url}/${IdeasApiRoutes.Delete}`),
    );

    return this.router;
  };
}
