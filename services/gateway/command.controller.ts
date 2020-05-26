import * as express from 'express';
import {
  controller,
  interfaces,
  httpPost,
  httpPut,
  httpDelete,
  httpGet,
} from 'inversify-express-utils';
import {inject} from 'inversify';

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
  RpcClient,
  IUserCommands,
  IAuthCommands,
  INotificationCommands,
  RpcClientFactory,
  RPC_CLIENT_FACTORY,
  IdeaCommands,
} from '@centsideas/rpc';
import {GlobalEnvironment} from '@centsideas/environment';

import {GatewayEnvironment} from './gateway.environment';
import {AuthMiddleware} from './middlewares';

@controller('')
export class CommandController implements interfaces.Controller {
  private ideasRpc: RpcClient<any> = this.rpcFactory(this.env.ideasHost, 'idea', 'IdeaCommands');
  private usersRpc: RpcClient<IUserCommands> = this.rpcFactory(
    this.env.usersHost,
    'user',
    'UserCommands',
  );
  private authRpc: RpcClient<IAuthCommands> = this.rpcFactory(
    this.env.usersHost,
    'auth',
    'AuthCommands',
  );
  private notificationsRpc: RpcClient<INotificationCommands> = this.rpcFactory(
    this.env.notificationsRpcHost,
    'notification',
    'NotificationCommands',
  );
  private idea2Rpc: RpcClient<IdeaCommands> = this.rpcFactory(
    this.env.ideaRpcHost,
    'idea',
    'IdeaCommands',
  );

  constructor(
    private env: GatewayEnvironment,
    private globalEnv: GlobalEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpPost(`/${ApiEndpoints.Ideas}`, AuthMiddleware)
  async createIdea(req: express.Request, res: express.Response) {
    const {title, description} = req.body;
    const {userId} = res.locals;
    return this.ideasRpc.client.create({userId, title, description});
  }

  @httpPut(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  updateIdea(req: express.Request, res: express.Response) {
    const ideaId = req.params.id;
    const {title, description} = req.body;
    const {userId} = res.locals;
    return this.ideasRpc.client.update({userId, title, description, ideaId});
  }

  @httpDelete(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  deleteIdea(req: express.Request, res: express.Response) {
    const ideaId = req.params.id;
    const {userId} = res.locals;
    return this.ideasRpc.client.delete({userId, ideaId});
  }

  @httpPut(`/${ApiEndpoints.Users}/:id`, AuthMiddleware)
  updateUser(req: express.Request, res: express.Response) {
    const {username, email} = req.body;
    const {userId} = res.locals;
    return this.usersRpc.client.update({username, email, userId});
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.GoogleLogin}`)
  async googleLogin(req: express.Request, res: express.Response) {
    const {code} = req.body;
    const {user, refreshToken, accessToken} = await this.authRpc.client.googleLogin({code});
    res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
    return {user, accessToken};
  }

  @httpGet(`/${ApiEndpoints.Auth}/${AuthApiRoutes.GoogleLoginRedirect}`)
  async googleLoginRedirectUrl() {
    const {url} = await this.authRpc.client.googleLoginRedirect(undefined);
    return {url};
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
        const {exchangeSecret} = req.body;
        if (
          this.env.frontendServerExchangeSecret === exchangeSecret ||
          this.globalEnv.environment === Environments.Dev
        ) {
          currentRefreshToken = req.body.refreshToken;
        }
      }
      if (!currentRefreshToken) {
        res.cookie(CookieNames.RefreshToken, '', {maxAge: 0});
        return {ok: false};
      }

      const data = await this.authRpc.client.refreshToken({refreshToken: currentRefreshToken});
      const {user, accessToken, refreshToken} = data;

      res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
      return {user, accessToken};
    } catch (error) {
      res.cookie(CookieNames.RefreshToken, '', {maxAge: 0});
      return {ok: false};
    }
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.Login}`)
  login(req: express.Request) {
    const {email} = req.body;
    return this.authRpc.client.login({email});
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.ConfirmLogin}`)
  async confirmLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {loginToken} = req.body;
    const data = await this.authRpc.client.confirmLogin({token: loginToken});
    const {user, accessToken, refreshToken} = data;
    res.cookie(CookieNames.RefreshToken, refreshToken, this.getRefreshTokenCookieOptions());
    return {user, accessToken};
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmEmailChange}`, AuthMiddleware)
  confirmEmailChange(req: express.Request, res: express.Response) {
    const {token} = req.body;
    const {userId} = res.locals;
    return this.usersRpc.client.confirmEmailChange({token, userId});
  }

  @httpPost(`/${ApiEndpoints.Auth}/${AuthApiRoutes.Logout}`, AuthMiddleware)
  async logout(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    await this.authRpc.client.logout({userId});
    res.cookie(CookieNames.RefreshToken, '', {maxAge: 0});
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.SubscribePush}`,
    AuthMiddleware,
  )
  subscribePush(req: express.Request, res: express.Response) {
    const {subscription} = req.body;
    const {userId} = res.locals;
    return this.notificationsRpc.client.subscribePush({subscription, userId});
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.UpdateSettings}`,
    AuthMiddleware,
  )
  updateNotificationSettings(req: express.Request, res: express.Response) {
    const {sendPushes, sendEmails} = req.body;
    const {userId} = res.locals;
    return this.notificationsRpc.client.updateSettings({sendPushes, sendEmails, userId});
  }

  @httpGet(`/${ApiEndpoints.Notifications}`, AuthMiddleware)
  getNotificationSettings(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.notificationsRpc.client.getSettings({userId});
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

  @httpPost(`/${ApiEndpoints.Idea}`, AuthMiddleware)
  createIdea2(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.idea2Rpc.client.create({userId});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/rename`, AuthMiddleware)
  renameIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {title} = req.body;
    return this.idea2Rpc.client.rename({id, userId, title});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/description`, AuthMiddleware)
  editIdeaDescription(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {description} = req.body;
    return this.idea2Rpc.client.editDescription({id, userId, description});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/tags`, AuthMiddleware)
  updateIdeaTags(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {tags} = req.body;
    return this.idea2Rpc.client.updateTags({id, userId, tags});
  }

  @httpPut(`/${ApiEndpoints.Idea}/:id/publish`, AuthMiddleware)
  publishIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.idea2Rpc.client.publish({id, userId});
  }

  @httpDelete(`/${ApiEndpoints.Idea}/:id`, AuthMiddleware)
  deleteIdea2(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.idea2Rpc.client.delete({id, userId});
  }
}
