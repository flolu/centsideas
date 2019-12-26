import { injectable } from 'inversify';
import * as express from 'express';

import { ExpressAdapter } from './express-adapter';
import { ApiEndpoints, UsersApiInternalRoutes, UsersApiRoutes } from '@cents-ideas/enums/src';

@injectable()
export class UsersRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  setup = (host: string): express.Router => {
    this.router.post(
      `/${UsersApiRoutes.Login}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiInternalRoutes.Login}`),
    );
    this.router.post(
      `/${UsersApiRoutes.ConfirmSignUp}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiInternalRoutes.ConfirmSignUp}`),
    );
    this.router.post(
      `/${UsersApiRoutes.Authenticate}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiInternalRoutes.Authenticate}`),
    );
    this.router.put(
      `/${UsersApiRoutes.Update}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiInternalRoutes.Update}`),
    );
    this.router.put(
      `/${UsersApiRoutes.ConfirmEmailChange}`,
      this.expressAdapter.makeJsonAdapter(`${host}/${ApiEndpoints.Users}/${UsersApiInternalRoutes.ConfirmEmailChange}`),
    );
    return this.router;
  };
}
