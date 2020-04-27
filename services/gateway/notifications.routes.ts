import { injectable } from 'inversify';
import * as express from 'express';

import { ExpressAdapter } from './express-adapter';
import { NotificationsApiRoutes } from '@centsideas/enums';

@injectable()
export class NotificationsRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string): express.Router => {
    const url = `http://${host}`;

    this.router.post(
      `/${NotificationsApiRoutes.SubscribePush}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${NotificationsApiRoutes.SubscribePush}`),
    );

    this.router.post(
      `/${NotificationsApiRoutes.UpdateSettings}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${NotificationsApiRoutes.UpdateSettings}`),
    );

    this.router.get(
      `/`,
      this.expressAdapter.makeJsonAdapter(`${url}/${NotificationsApiRoutes.GetSettings}`),
    );

    return this.router;
  };
}
