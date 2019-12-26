import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { UsersApiInternalRoutes } from '@cents-ideas/enums';

import env from './environment';
import { UsersService } from './users.service';

@injectable()
export class UsersServer {
  private app = express();

  constructor(private logger: Logger, private usersService: UsersService, private expressAdapter: ExpressAdapter) {}

  start = () => {
    this.logger.debug('initialized with env: ', env);

    this.app.use(bodyParser.json());

    this.app.post(`/${UsersApiInternalRoutes.Login}`, this.expressAdapter.json(this.usersService.login));
    this.app.post(
      `/${UsersApiInternalRoutes.ConfirmSignUp}`,
      this.expressAdapter.json(this.usersService.confirmSignUp),
    );
    this.app.post(`/${UsersApiInternalRoutes.Authenticate}`, this.expressAdapter.json(this.usersService.authenticate));
    this.app.post(`/${UsersApiInternalRoutes.Update}`, this.expressAdapter.json(this.usersService.updateUser));
    this.app.post(
      `/${UsersApiInternalRoutes.ConfirmEmailChange}`,
      this.expressAdapter.json(this.usersService.confirmEmailChange),
    );

    this.app.get(`/${UsersApiInternalRoutes.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(env.port, () => this.logger.info('users service listening on internal port', env.port));
  };
}
