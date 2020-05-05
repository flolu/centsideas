import * as http from 'http';
import { injectable, inject } from 'inversify';

import { Logger } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';
// TODO group imports?
import {
  RpcServer,
  IUserCommands,
  UpdateUser,
  ConfirmEmailChange,
  IAuthCommands,
  Login,
  ConfirmLogin,
  GoogleLogin,
  GoogleLoginRedicrect,
  Logout,
  RefreshToken,
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
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    Logger.info('launch in', this.globalEnv.environment, 'mode');
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const userService = this.rpcServer.loadService('user', 'UserCommands');
    this.rpcServer.addService<IUserCommands>(userService, {
      update: this.update,
      confirmEmailChange: this.confirmEmailChange,
    });

    const authService = this.rpcServer.loadService('auth', 'AuthCommands');
    this.rpcServer.addService<IAuthCommands>(authService, {
      login: this.login,
      confirmLogin: this.confirmLogin,
      googleLogin: this.googleLogin,
      googleLoginRedirect: this.googleLoginRedirect,
      logout: this.logout,
      refreshToken: this.refreshToken,
    });
  }

  // TODO pass objects directly into handler without destructing (destructure in handler)... also for all other backend services
  login: Login = async ({ email }) => this.authHandler.login(email);
  confirmLogin: ConfirmLogin = ({ token }) => this.authHandler.confirmLogin(token);
  googleLogin: GoogleLogin = ({ code }) => this.authHandler.googleLogin(code);
  googleLoginRedirect: GoogleLoginRedicrect = async () => this.authHandler.googleLoginRedirect();
  logout: Logout = async ({ userId }) => this.authHandler.logout(userId);
  refreshToken: RefreshToken = async ({ refreshToken }) =>
    this.authHandler.refreshToken(refreshToken);
  update: UpdateUser = async ({ userId, username, email }) =>
    this.usersHandler.updateUser(userId, username, email);
  confirmEmailChange: ConfirmEmailChange = async ({ token, userId }) =>
    this.usersHandler.confirmEmailChange(token, userId);
}
