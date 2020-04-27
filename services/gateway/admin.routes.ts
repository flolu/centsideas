import { injectable } from 'inversify';
import * as express from 'express';

import { AdminApiRoutes } from '@centsideas/enums';
import { ExpressAdapter } from './express-adapter';

@injectable()
export class AdminRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string): express.Router => {
    const url = `http://${host}`;

    this.router.get(
      `/${AdminApiRoutes.Events}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${AdminApiRoutes.GetEvents}`),
    );

    return this.router;
  };
}
