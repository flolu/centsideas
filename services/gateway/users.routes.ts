import { injectable } from 'inversify';
import * as express from 'express';

import { ExpressAdapter } from './express-adapter';
import { UsersApiRoutes, ApiEndpoints } from '@centsideas/enums';

@injectable()
export class UsersRoutes {
  private router = express.Router();

  constructor(private expressAdapter: ExpressAdapter) {}

  // FIXME consider creating abstraction layer (maybe with decorators)
  setup = (host: string, consumerHost: string): express.Router => {
    const url = `http://${host}`;
    const consumerUrl = `http://${consumerHost}`;

    this.router.get(
      `/`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerUrl}/${ApiEndpoints.Users}/${UsersApiRoutes.GetAll}`,
      ),
    );

    this.router.post(
      `/${UsersApiRoutes.GoogleLogin}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.GoogleLogin}`),
    );
    this.router.get(
      `/${UsersApiRoutes.GoogleLoginRedirect}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.GoogleLoginRedirect}`),
    );

    this.router.get(
      `/:id`,
      this.expressAdapter.makeJsonAdapter(
        `${consumerUrl}/${ApiEndpoints.Users}/${UsersApiRoutes.GetById}`,
      ),
    );

    this.router.post(
      `/${UsersApiRoutes.RefreshToken}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.RefreshToken}`),
    );

    this.router.post(
      `/${UsersApiRoutes.Login}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.Login}`),
    );

    this.router.post(
      `/${UsersApiRoutes.ConfirmLogin}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.ConfirmLogin}`),
    );

    this.router.put(`/:id`, this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.Update}`));

    this.router.post(
      `/${UsersApiRoutes.ConfirmEmailChange}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.ConfirmEmailChange}`),
    );

    this.router.post(
      `/${UsersApiRoutes.Logout}`,
      this.expressAdapter.makeJsonAdapter(`${url}/${UsersApiRoutes.Logout}`),
    );

    return this.router;
  };
}
