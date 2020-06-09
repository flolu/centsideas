import * as express from 'express';
import {inject} from 'inversify';
import {controller, interfaces, httpPost} from 'inversify-express-utils';

import {ApiEndpoints, CookieNames, TokenExpirationTimes, Environments} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {AuthenticationCommands, AuthenticationCommandsService} from '@centsideas/schemas';
import {GlobalConfig} from '@centsideas/config';

import {GatewayConfig} from './gateway.config';

@controller(`/${ApiEndpoints.Authentication}`)
export class AuthenticationController implements interfaces.Controller {
  private readonly isProd = this.globalConfig.get('global.environment') === Environments.Prod;
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

  @httpPost('/signin/email')
  requestEmailSignIn(req: express.Request) {
    const {email} = req.body;
    return this.authenticationRpc.client.requestEmailSignIn({email});
  }

  @httpPost('/signin/email/confirm')
  async confirmEmailSignIn(req: express.Request, res: express.Response) {
    const {token} = req.body;
    const data = await this.authenticationRpc.client.confirmEmailSignIn({signInToken: token});
    const {refreshToken, accessToken, userId} = data;
    res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions);
    return {accessToken, userId};
  }

  @httpPost('/refresh')
  async refreshToken(req: express.Request, res: express.Response) {
    try {
      const current = req.cookies[CookieNames.RefreshToken];

      const data = await this.authenticationRpc.client.refreshToken({refreshToken: current});
      const {accessToken, refreshToken, userId} = data;
      res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions);
      return {accessToken, userId};
    } catch (error) {
      res.cookie(CookieNames.RefreshToken, '', {maxAge: 0}).status(401);
      throw error;
    }
  }

  @httpPost('/signout')
  async signOut(req: express.Request, res: express.Response) {
    const refreshToken = req.cookies[CookieNames.RefreshToken];
    await this.authenticationRpc.client.signOut({refreshToken});
    res.cookie(CookieNames.RefreshToken, '', {maxAge: 0});
  }

  @httpPost('/revoke')
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
