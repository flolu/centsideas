import * as express from 'express';
import {
  controller,
  interfaces,
  httpPost,
  httpPut,
  httpDelete,
  httpGet,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import {
  ApiEndpoints,
  UsersApiRoutes,
  NotificationsApiRoutes,
  CookieNames,
  TokenExpirationTimes,
  Environments,
  AuthApiRoutes,
} from '@centsideas/enums';
import {
  IIdeaCommands,
  RpcClient,
  IUserCommands,
  IAuthCommands,
  INotificationCommands,
} from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { GatewayEnvironment } from './gateway.environment';
import { AuthMiddleware } from './middlewares';
import TYPES from './types';

@controller('')
export class CommandController implements interfaces.Controller {
  constructor(
    private env: GatewayEnvironment,
    private globalEnv: GlobalEnvironment,
    @inject(TYPES.IDEAS_COMMAND_RPC_CLIENT) private ideasRpc: IIdeaCommands,
    @inject(TYPES.USERS_COMMAND_RPC_CLIENT) private usersRpc: IUserCommands,
    @inject(TYPES.AUTH_COMMAND_RPC_CLIENT) private authRpc: IAuthCommands,
    @inject(TYPES.NOTIFICATIONS_COMMAND_RPC_CLIENT)
    private notificationsRpc: INotificationCommands,
  ) {}

  @httpPost(`/${ApiEndpoints.Ideas}`, AuthMiddleware)
  async createIdea(req: express.Request, res: express.Response) {
    const { title, description } = req.body;
    const { userId } = res.locals;
    return this.ideasRpc.create({ userId, title, description });
  }

  @httpPut(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  updateIdea(req: express.Request, res: express.Response) {
    const ideaId = req.params.id;
    const { title, description } = req.body;
    const { userId } = res.locals;
    return this.ideasRpc.update({ userId, title, description, ideaId });
  }

  @httpDelete(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  deleteIdea(req: express.Request, res: express.Response) {
    const ideaId = req.params.id;
    const { userId } = res.locals;
    return this.ideasRpc.delete({ userId, ideaId });
  }

  @httpPut(`/${ApiEndpoints.Users}/:id`, AuthMiddleware)
  updateUser(req: express.Request, res: express.Response) {
    const { username, email } = req.body;
    const { userId } = res.locals;
    return this.usersRpc.update({ username, email, userId });
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.GoogleLogin}`)
  async googleLogin(req: express.Request, res: express.Response) {
    const { code } = req.body;
    const { user, refreshToken, accessToken } = await this.authRpc.googleLogin({ code });
    res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
    return { user, accessToken };
  }

  @httpGet(`/${ApiEndpoints.Auth}/${AuthApiRoutes.GoogleLoginRedirect}`)
  async googleLoginRedirectUrl() {
    const { url } = await this.authRpc.googleLoginRedirect(undefined);
    return { url };
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.RefreshToken}`)
  async refreshToken(req: express.Request, res: express.Response) {
    try {
      let currentRefreshToken = req.cookies[CookieNames.RefreshToken];

      if (!currentRefreshToken) {
        /**
         * To enable authentication for server-side rendered content we pass the refresh
         * token in the request body from the ssr server, which is usually not a good practice
         * to do from a normal client. Thus we only accept this authentication when the request
         * indeed cam from our client server.
         * Therefore we share an `exchangeSecret` between the client and this user service
         * to guarantee the authenticity of the request.
         * Here we validate if the `exchangeSecret`s match
         */
        const { exchangeSecret } = req.body;
        if (
          this.env.frontendServerExchangeSecret === exchangeSecret ||
          this.globalEnv.environment === Environments.Dev
        ) {
          currentRefreshToken = req.body.refreshToken;
        }
      }
      if (!currentRefreshToken) {
        res.cookie(CookieNames.RefreshToken, '', { maxAge: 0 });
        return { ok: false };
      }

      const data = await this.authRpc.refreshToken({ refreshToken: currentRefreshToken });
      const { user, accessToken, refreshToken } = data;

      res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
      return { user, accessToken };
    } catch (error) {
      res.cookie(CookieNames.RefreshToken, '', { maxAge: 0 });
      return { ok: false };
    }
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.Login}`)
  login(req: express.Request) {
    const { email } = req.body;
    return this.authRpc.login({ email });
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.ConfirmLogin}`)
  async confirmLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { loginToken } = req.body;
    const data = await this.authRpc.confirmLogin({ token: loginToken });
    const { user, accessToken, refreshToken } = data;
    res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
    return { user, accessToken };
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmEmailChange}`, AuthMiddleware)
  confirmEmailChange(req: express.Request, res: express.Response) {
    const { token } = req.body;
    const { userId } = res.locals;
    return this.usersRpc.confirmEmailChange({ token, userId });
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.Logout}`, AuthMiddleware)
  async logout(_req: express.Request, res: express.Response) {
    const { userId } = res.locals;
    await this.authRpc.logout({ userId });
    res.cookie(CookieNames.RefreshToken, '', { maxAge: 0 });
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.SubscribePush}`,
    AuthMiddleware,
  )
  subscribePush(req: express.Request, res: express.Response) {
    const { subscription } = req.body;
    const { userId } = res.locals;
    return this.notificationsRpc.subscribePush({ subscription, userId });
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.UpdateSettings}`,
    AuthMiddleware,
  )
  updateNotificationSettings(req: express.Request, res: express.Response) {
    const { sendPushes, sendEmails } = req.body;
    const { userId } = res.locals;
    return this.notificationsRpc.updateSettings({ sendPushes, sendEmails, userId });
  }

  @httpGet(`/${ApiEndpoints.Notifications}`, AuthMiddleware)
  getNotificationSettings(_req: express.Request, res: express.Response) {
    const { userId } = res.locals;
    return this.notificationsRpc.getSettings({ userId });
  }

  private getRefreshTokenCookieOptions = () => {
    const options: express.CookieOptions = {
      httpOnly: true,
      maxAge: TokenExpirationTimes.RefreshToken * 1000,
    };
    if (this.globalEnv.environment === Environments.Prod) {
      options.sameSite = 'strict';
      options.secure = true;
    }
    return options;
  };
}
