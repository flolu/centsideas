import * as express from 'express';
import {controller, interfaces, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import {inject} from 'inversify';

import {ApiEndpoints, CookieNames, TokenExpirationTimes, Environments} from '@centsideas/enums';
import {RpcClient, RpcClientFactory, RPC_CLIENT_FACTORY} from '@centsideas/rpc';
import {
  IdeaCommands,
  IdeaCommandsService,
  AuthenticationCommands,
  AuthenticationCommandsService,
} from '@centsideas/schemas';
import {GlobalConfig} from '@centsideas/config';

import {GatewayConfig} from './gateway.config';
import {AuthMiddleware} from './auth.middleware';

// TODO split into multple controllers
@controller('')
export class CommandController implements interfaces.Controller {
  private readonly isProd = this.globalConfig.get('global.environment') === Environments.Prod;
  private ideaRpc: RpcClient<IdeaCommands.Service> = this.rpcFactory({
    host: this.config.get('idea.rpc.host'),
    service: IdeaCommandsService,
    port: this.config.getNumber('idea.rpc.port'),
  });
  private authenticationRpc: RpcClient<AuthenticationCommands.Service> = this.rpcFactory({
    host: this.config.get('authentication.rpc.host'),
    port: this.config.getNumber('authentication.rpc.port'),
    service: AuthenticationCommandsService,
  });

  constructor(
    private config: GatewayConfig,
    private globalConfig: GlobalConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpPost(`/${ApiEndpoints.Idea}`, AuthMiddleware)
  createIdea(_req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    return this.ideaRpc.client.create({userId});
  }
  @httpPut(`/${ApiEndpoints.Idea}/:id/rename`, AuthMiddleware)
  renameIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {title} = req.body;
    return this.ideaRpc.client.rename({id, userId, title});
  }
  @httpPut(`/${ApiEndpoints.Idea}/:id/description`, AuthMiddleware)
  editIdeaDescription(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {description} = req.body;
    return this.ideaRpc.client.editDescription({id, userId, description});
  }
  @httpPut(`/${ApiEndpoints.Idea}/:id/tags`, AuthMiddleware)
  updateIdeaTags(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {tags} = req.body;
    return this.ideaRpc.client.updateTags({id, userId, tags});
  }
  @httpPut(`/${ApiEndpoints.Idea}/:id/publish`, AuthMiddleware)
  publishIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.ideaRpc.client.publish({id, userId});
  }
  @httpDelete(`/${ApiEndpoints.Idea}/:id`, AuthMiddleware)
  deleteIdea(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.ideaRpc.client.delete({id, userId});
  }

  @httpPost(`/${ApiEndpoints.Authentication}/signin/email`)
  requestEmailSignIn(req: express.Request) {
    const {email} = req.body;
    return this.authenticationRpc.client.requestEmailSignIn({email});
  }
  @httpPost(`/${ApiEndpoints.Authentication}/signin/email/confirm`)
  async confirmEmailSignIn(req: express.Request, res: express.Response) {
    const {token} = req.body;
    const data = await this.authenticationRpc.client.confirmEmailSignIn({signInToken: token});
    const {refreshToken, accessToken, userId} = data;
    res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions);
    return {accessToken, userId};
  }
  @httpPost(`/${ApiEndpoints.Authentication}/refresh`)
  async refreshToken(req: express.Request, res: express.Response) {
    try {
      const current = req.cookies[CookieNames.RefreshToken];
      if (!current) return res.cookie(CookieNames.RefreshToken, '', {maxAge: 0}).status(401);

      const data = await this.authenticationRpc.client.refreshToken({refreshToken: current});
      const {accessToken, refreshToken, userId} = data;
      res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions);
      return {userId, accessToken};
    } catch (error) {
      return res.cookie(CookieNames.RefreshToken, '', {maxAge: 0}).status(401);
    }
  }
  @httpPost(`/${ApiEndpoints.Authentication}/signout`)
  async signOut(req: express.Request, res: express.Response) {
    const refreshToken = req.cookies[CookieNames.RefreshToken];
    await this.authenticationRpc.client.signOut({refreshToken});
    return res.cookie(CookieNames.RefreshToken, '', {maxAge: 0}).status(401);
  }
  @httpPost(`/${ApiEndpoints.Authentication}/revoke`)
  revokeRefreshToken(req: express.Request) {
    const {sessionId} = req.body;
    return this.authenticationRpc.client.revokeRefreshToken({sessionId});
  }

  private get refreshTokenCookieOptions(): express.CookieOptions {
    return {
      httpOnly: true,
      maxAge: TokenExpirationTimes.RefreshToken * 1000,
      sameSite: this.isProd ? 'strict' : 'lax',
      secure: this.isProd ? true : false,
    };
  }
}
