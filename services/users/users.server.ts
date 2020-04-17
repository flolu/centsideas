import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { ExpressAdapter, Logger } from '@cents-ideas/utils';
import { UsersApiRoutes } from '@cents-ideas/enums';

import env from './environment';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

@injectable()
export class UsersServer {
  private app = express();

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private expressAdapter: ExpressAdapter,
  ) {}

  start = () => {
    this.app.use(bodyParser.json());

    this.app.post(`/${UsersApiRoutes.Login}`, this.expressAdapter.json(this.authService.login));

    this.app.post(
      `/${UsersApiRoutes.ConfirmLogin}`,
      this.expressAdapter.json(this.authService.confirmLogin),
    );

    this.app.post(
      `/${UsersApiRoutes.GoogleLogin}`,
      this.expressAdapter.json(this.authService.googleLogin),
    );

    this.app.post(
      `/${UsersApiRoutes.GoogleLoginRedirect}`,
      this.expressAdapter.json(this.authService.googleLoginRedirect),
    );

    this.app.post(`/${UsersApiRoutes.Logout}`, this.expressAdapter.json(this.authService.logout));

    this.app.post(
      `/${UsersApiRoutes.RefreshToken}`,
      this.expressAdapter.json(this.authService.refreshToken),
    );

    this.app.post(
      `/${UsersApiRoutes.Update}`,
      this.expressAdapter.json(this.usersService.updateUser),
    );

    this.app.post(
      `/${UsersApiRoutes.ConfirmEmailChange}`,
      this.expressAdapter.json(this.usersService.confirmEmailChange),
    );

    this.app.get(`/${UsersApiRoutes.Alive}`, (_req, res) => res.status(200).send());

    this.app.listen(env.port, () =>
      Logger.debug('users service listening on internal port', env.port),
    );
  };
}
