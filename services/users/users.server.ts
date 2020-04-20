import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters } from '@centsideas/utils';
import { UsersApiRoutes } from '@centsideas/enums';

import { UsersEnvironment } from './users.environment';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

@injectable()
export class UsersServer {
  private app = express();

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private env: UsersEnvironment,
  ) {}

  start = () => {
    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.app.post(`/${UsersApiRoutes.Login}`, ExpressAdapters.json(this.authService.login));

    this.app.post(
      `/${UsersApiRoutes.ConfirmLogin}`,
      ExpressAdapters.json(this.authService.confirmLogin),
    );

    this.app.post(
      `/${UsersApiRoutes.GoogleLogin}`,
      ExpressAdapters.json(this.authService.googleLogin),
    );

    this.app.post(
      `/${UsersApiRoutes.GoogleLoginRedirect}`,
      ExpressAdapters.json(this.authService.googleLoginRedirect),
    );

    this.app.post(`/${UsersApiRoutes.Logout}`, ExpressAdapters.json(this.authService.logout));

    this.app.post(
      `/${UsersApiRoutes.RefreshToken}`,
      ExpressAdapters.json(this.authService.refreshToken),
    );

    this.app.post(`/${UsersApiRoutes.Update}`, ExpressAdapters.json(this.usersService.updateUser));

    this.app.post(
      `/${UsersApiRoutes.ConfirmEmailChange}`,
      ExpressAdapters.json(this.usersService.confirmEmailChange),
    );

    this.app.get(`/${UsersApiRoutes.Alive}`, (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  };
}
