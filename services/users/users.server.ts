import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';
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
} from '@centsideas/rpc';

import { UsersHandler } from './users.handler';
import { AuthHandler } from './auth.handler';

@injectable()
export class UsersServer {
  constructor(
    private globalEnv: GlobalEnvironment,
    private rpcServer: RpcServer,
    private usersHandler: UsersHandler,
    private authHandler: AuthHandler,
  ) {
    Logger.info('launch in', this.globalEnv.environment, 'mode');

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

  login: Login = async ({ email }) => {
    await this.authHandler.login(email);
  };

  confirmLogin: ConfirmLogin = ({ token }) => {
    return this.authHandler.confirmLogin(token);
  };

  googleLogin: GoogleLogin = ({ code }) => {
    return this.authHandler.googleLogin(code);
  };

  googleLoginRedirect: GoogleLoginRedicrect = async () => {
    const url = await this.authHandler.googleLoginRedirect();
    return { url };
  };

  logout: Logout = async ({ userId }) => {
    return this.authHandler.logout(userId);
  };

  refreshToken: RefreshToken = async ({ refreshToken }) => {
    return this.authHandler.refreshToken(refreshToken);
  };

  update: UpdateUser = async ({ userId, username, email }) => {
    const updated = await this.usersHandler.updateUser(userId, username, email);
    return updated.persistedState;
  };

  confirmEmailChange: ConfirmEmailChange = async ({ token, userId }) => {
    const updated = await this.usersHandler.confirmEmailChange(token, userId);
    return updated.persistedState;
  };
}
