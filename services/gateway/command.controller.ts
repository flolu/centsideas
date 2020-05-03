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
  AdminApiRoutes,
  CookieNames,
  TokenExpirationTimes,
  Environments,
} from '@centsideas/enums';
import { IIdeaCommands, RpcClient, IUserCommands, IAuthCommands } from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import { AuthMiddleware } from './middlewares';
import TYPES from './types';

@controller('')
export class CommandController implements interfaces.Controller {
  constructor(
    // TODO remove
    private expressAdapter: ExpressAdapter,
    private env: GatewayEnvironment,
    private globalEnv: GlobalEnvironment,
    @inject(TYPES.IDEAS_COMMAND_RPC_CLIENT) private ideasRpc: RpcClient<IIdeaCommands>,
    @inject(TYPES.USERS_COMMAND_RPC_CLIENT) private usersRpc: RpcClient<IUserCommands>,
    @inject(TYPES.AUTH_COMMAND_RPC_CLIENT) private authRpc: RpcClient<IAuthCommands>,
  ) {}

  // TODO error handling https://stackoverflow.com/questions/48748745 https://grpc.io/docs/guides/error/ https://github.com/avinassh/grpc-errors/tree/master/node
  @httpPost(`/${ApiEndpoints.Ideas}`, AuthMiddleware)
  async createIdea(req: express.Request, res: express.Response) {
    const { title, description } = req.body;
    const { userId } = res.locals;
    // TODO would be cool to just have `this.ideasRpc.create(...)` (maybe i can inject the client! or i add methods to rpc class at runtime?)
    return this.ideasRpc.client.create({ userId, title, description });
  }

  @httpPut(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  updateIdea(req: express.Request, res: express.Response) {
    const ideaId = req.params.id;
    const { title, description } = req.body;
    const { userId } = res.locals;
    return this.ideasRpc.client.update({ userId, title, description, ideaId });
  }

  @httpDelete(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  deleteIdea(req: express.Request, res: express.Response) {
    const ideaId = req.params.id;
    const { userId } = res.locals;
    return this.ideasRpc.client.delete({ userId, ideaId });
  }

  @httpPut(`/${ApiEndpoints.Users}/:id`, AuthMiddleware)
  updateUser(req: express.Request, res: express.Response) {
    const { username, email } = req.body;
    const { userId } = res.locals;
    return this.usersRpc.client.update({ username, email, userId });
  }

  // TODO rename auth routes to /auth
  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.GoogleLogin}`)
  async googleLogin(req: express.Request, res: express.Response) {
    const { code } = req.body;
    const { user, refreshToken, accessToken } = await this.authRpc.client.googleLogin({ code });
    res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
    return { user, accessToken };
  }

  @httpGet(`/${ApiEndpoints.Users}/${UsersApiRoutes.GoogleLoginRedirect}`)
  async googleLoginRedirectUrl() {
    const { url } = await this.authRpc.client.googleLoginRedirect(undefined);
    return { url };
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.RefreshToken}`, AuthMiddleware)
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

      const data = await this.authRpc.client.refreshToken({ refreshToken: currentRefreshToken });
      const { user, accessToken, refreshToken } = data;

      res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
      return { user, accessToken };
    } catch (error) {
      res.cookie(CookieNames.RefreshToken, '', { maxAge: 0 });
      return { ok: false };
    }
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.Login}`)
  login(req: express.Request) {
    const { email } = req.body;
    return this.authRpc.client.login({ email });
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmLogin}`)
  async confirmLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { loginToken } = req.body;
    const data = await this.authRpc.client.confirmLogin({ token: loginToken });
    const { user, accessToken, refreshToken } = data;
    res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
    return { user, accessToken };
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmEmailChange}`, AuthMiddleware)
  confirmEmailChange(req: express.Request, res: express.Response) {
    const { token } = req.body;
    const { userId } = res.locals;
    return this.usersRpc.client.confirmEmailChange({ token, userId });
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.Logout}`, AuthMiddleware)
  async logout(_req: express.Request, res: express.Response) {
    const { userId } = res.locals;
    await this.authRpc.client.logout({ userId });
    res.cookie(CookieNames.RefreshToken, '', { maxAge: 0 });
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.SubscribePush}`,
    AuthMiddleware,
  )
  subscribePush(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.SubscribePush}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.UpdateSettings}`,
    AuthMiddleware,
  )
  updateNotificationSettings(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.UpdateSettings}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Notifications}`, AuthMiddleware)
  getNotificationSettings(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.GetSettings}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Admin}`)
  getAdminEvents(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.adminHost}/${AdminApiRoutes.GetEvents}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
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
