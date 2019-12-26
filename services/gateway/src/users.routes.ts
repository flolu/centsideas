import { injectable } from 'inversify';
import * as express from 'express';

import { ExpressAdapter } from './express-adapter';
import { ApiEndpoints, UsersApiRoutes } from '@cents-ideas/enums/src';

@injectable()
export class UsersRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string): express.Router => {
    this.router.post(
      `/${UsersApiRoutes.Login}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiRoutes.Login}`),
    );
    this.router.post(
      `/${UsersApiRoutes.ConfirmSignUp}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmSignUp}`),
    );
    this.router.post(
      `/${UsersApiRoutes.Authenticate}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiRoutes.Authenticate}`),
    );
    this.router.put(
      `/${UsersApiRoutes.Update}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiRoutes.Update}`),
    );
    this.router.put(
      `/${UsersApiRoutes.ConfirmEmailChange}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmEmailChange}`),
    );
    return this.router;
  };
}
