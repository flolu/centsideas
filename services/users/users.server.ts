import * as http from 'http';
import { injectable, inject } from 'inversify';

import { Logger } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';
import {
  RpcServer,
  IUserCommands,
  IAuthCommands,
  RPC_TYPES,
  RpcServerFactory,
} from '@centsideas/rpc';

import { UsersHandler } from './users.handler';
import { AuthHandler } from './auth.handler';
import { UsersEnvironment } from './users.environment';

@injectable()
export class UsersServer {
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: UsersEnvironment,
    private globalEnv: GlobalEnvironment,
    private usersHandler: UsersHandler,
    private authHandler: AuthHandler,
    private logger: Logger,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');
    this.logger.info('launch with worker id', process.env.NODE_UNIQUE_ID);

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const userService = this.rpcServer.loadService('user', 'UserCommands');
    this.rpcServer.addService<IUserCommands>(userService, {
      update: this.usersHandler.update,
      confirmEmailChange: this.usersHandler.confirmEmailChange,
    });

    const authService = this.rpcServer.loadService('auth', 'AuthCommands');
    this.rpcServer.addService<IAuthCommands>(authService, {
      login: this.authHandler.login,
      confirmLogin: this.authHandler.confirmLogin,
      googleLogin: this.authHandler.googleLogin,
      googleLoginRedirect: this.authHandler.googleLoginRedirect,
      logout: this.authHandler.logout,
      refreshToken: this.authHandler.refreshToken,
    });
  }
}
