import { injectable } from 'inversify';
import * as express from 'express';

import { ExpressAdapter } from './express-adapter';
import { UsersApiRoutes, ApiEndpoints } from '@cents-ideas/enums';

@injectable()
export class UsersRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string, consumerHost: string): express.Router => {
    this.router.get(
      `/`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerHost}/${ApiEndpoints.Users}/${UsersApiRoutes.GetAll}`,
      ),
    );
    this.router.get(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerHost}/${ApiEndpoints.Users}/${UsersApiRoutes.GetById}`,
      ),
    );
    this.router.post(
      `/${UsersApiRoutes.Login}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${UsersApiRoutes.Login}`),
    );
    this.router.post(
      `/${UsersApiRoutes.Authenticate}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${UsersApiRoutes.Authenticate}`),
    );
    this.router.put(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(`${host}/${UsersApiRoutes.Update}`),
    );
    this.router.post(
      `/${UsersApiRoutes.ConfirmEmailChange}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${UsersApiRoutes.ConfirmEmailChange}`),
    );

    return this.router;
  };
}
