import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { IServer } from '@cents-ideas/models';
import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { UsersApiInternalRoutes } from '@cents-ideas/enums';

import { IUsersServiceEnvironment } from './environment';
import { UsersService } from './users.service';

@injectable()
export class UsersServer implements IServer {
  private app = express();

  constructor(private logger: Logger, private usersService: UsersService, private expressAdapter: ExpressAdapter) {}

  start = (env: IUsersServiceEnvironment) => {
    this.logger.debug('initialized with env: ', env);
    const { port } = env;

    this.app.use(bodyParser.json());

    this.app.put(
      `${UsersApiInternalRoutes.ReAuthenticate}`,
      this.expressAdapter.json(this.usersService.reAuthenticate),
    );
    this.app.put(`${UsersApiInternalRoutes.Login}`, this.expressAdapter.json(this.usersService.login));
    this.app.put(`${UsersApiInternalRoutes.ConfirmLogin}`, this.expressAdapter.json(this.usersService.confirmLogin));

    this.app.get(`/${UsersApiInternalRoutes.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(port, () => this.logger.info('users service listening on internal port', port));
  };
}
