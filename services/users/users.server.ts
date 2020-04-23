import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapters } from '@centsideas/utils';
import { UsersApiRoutes } from '@centsideas/enums';

import { UsersEnvironment } from './users.environment';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@injectable()
export class UsersServer {
  private app = express();
  private routes = UsersApiRoutes;

  constructor(
    private authService: AuthService,
    private env: UsersEnvironment,
    private usersService: UsersService,
  ) {
    Logger.log('launch', this.env.environment);
    this.app.use(bodyParser.json());

    this.registerAuthRoutes();
    this.registerUserRoutes();

    this.app.get(`/${this.routes.Alive}`, (_req, res) => res.status(200).send());
    this.app.listen(this.env.port);
  }

  private registerAuthRoutes() {
    this.app.post(`/${this.routes.Login}`, ExpressAdapters.json(this.authService.login));
    this.app.post(
      `/${this.routes.ConfirmLogin}`,
      ExpressAdapters.json(this.authService.confirmLogin),
    );
    this.app.post(
      `/${this.routes.GoogleLogin}`,
      ExpressAdapters.json(this.authService.googleLogin),
    );
    this.app.post(
      `/${this.routes.GoogleLoginRedirect}`,
      ExpressAdapters.json(this.authService.googleLoginRedirect),
    );
    this.app.post(`/${this.routes.Logout}`, ExpressAdapters.json(this.authService.logout));
    this.app.post(
      `/${this.routes.RefreshToken}`,
      ExpressAdapters.json(this.authService.refreshToken),
    );
  }

  private registerUserRoutes() {
    this.app.post(`/${this.routes.Update}`, ExpressAdapters.json(this.usersService.updateUser));
    this.app.post(
      `/${this.routes.ConfirmEmailChange}`,
      ExpressAdapters.json(this.usersService.confirmEmailChange),
    );
  }
}
