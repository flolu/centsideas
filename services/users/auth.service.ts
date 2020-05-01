import { injectable } from 'inversify';

import {
  HttpStatusCodes,
  CookieNames,
  TokenExpirationTimes,
  Environments,
} from '@centsideas/enums';
import { HttpRequest, HttpResponse, Cookie, Dtos } from '@centsideas/models';
import { handleHttpResponseError } from '@centsideas/utils';
import { GlobalEnvironment } from '@centsideas/environment';

import { UsersEnvironment } from './users.environment';
import { AuthHandler } from './auth.handler';
import { CookieOptions } from 'express';

@injectable()
export class AuthService {
  constructor(
    private commandHandler: AuthHandler,
    private env: UsersEnvironment,
    private globalEnv: GlobalEnvironment,
  ) {}

  login = async (req: HttpRequest<Dtos.ILoginDto>) => {
    const { email } = req.body;

    await this.commandHandler.login(email);

    return { status: HttpStatusCodes.Accepted, body: {} };
  };

  confirmLogin = async (
    req: HttpRequest<Dtos.IConfirmLoginDto>,
  ): Promise<HttpResponse<Dtos.IConfirmedLoginDto>> => {
    const { loginToken } = req.body;

    const data = await this.commandHandler.confirmLogin(loginToken);
    const { user, accessToken, refreshToken } = data;
    const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);

    return {
      status: HttpStatusCodes.Accepted,
      body: { user, accessToken },
      cookies: [refreshTokenCookie],
    };
  };

  googleLoginRedirect = async (
    req: HttpRequest,
  ): Promise<HttpResponse<Dtos.IGoogleLoginRedirectDto>> => {
    const origin = req.headers.origin;

    const url = this.commandHandler.googleLoginRedirect(origin);

    return { status: HttpStatusCodes.Accepted, body: { url } };
  };

  googleLogin = async (
    req: HttpRequest<Dtos.IGoogleLoginDto>,
  ): Promise<HttpResponse<Dtos.IGoogleLoggedInDto>> => {
    const { code } = req.body;
    const origin = req.headers.origin;

    const data = await this.commandHandler.googleLogin(code, origin);

    const { user, accessToken, refreshToken } = data;
    const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);

    return {
      status: HttpStatusCodes.Accepted,
      body: { user, accessToken },
      cookies: [refreshTokenCookie],
    };
  };

  refreshToken = async (req: HttpRequest): Promise<HttpResponse<Dtos.IRefreshedTokenDto>> => {
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
          this.env.exchangeSecrets.frontendServer === exchangeSecret ||
          this.globalEnv.environment === Environments.Dev
        ) {
          currentRefreshToken = req.body.refreshToken;
        }
      }

      const data = await this.commandHandler.refreshToken(currentRefreshToken);

      const { user, accessToken, refreshToken } = data;
      const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);

      return {
        status: HttpStatusCodes.Accepted,
        body: { user: user.persistedState, accessToken, ok: true },
        cookies: [refreshTokenCookie],
      };
    } catch (error) {
      const clearRefreshTokenCookie = new Cookie(CookieNames.RefreshToken, '', { maxAge: 0 });
      if (error.status === HttpStatusCodes.BadRequest) {
        return {
          status: HttpStatusCodes.Accepted,
          body: { user: null, accessToken: '', ok: false },
          cookies: [clearRefreshTokenCookie],
        };
      }

      return handleHttpResponseError(error, { cookies: [clearRefreshTokenCookie] });
    }
  };

  logout = async (_req: HttpRequest): Promise<HttpResponse<{}>> => {
    const clearRefreshTokenCookie = new Cookie(CookieNames.RefreshToken, '', { maxAge: 0 });

    return {
      status: HttpStatusCodes.Accepted,
      body: {},
      cookies: [clearRefreshTokenCookie],
    };
  };

  // FIXME implement such that access to this controller is only for admins
  revokeRefreshToken = async (req: HttpRequest): Promise<HttpResponse<{}>> => {
    const { userId, reason } = req.body;

    await this.commandHandler.revokeRefreshToken(userId, reason);

    return {
      status: HttpStatusCodes.Accepted,
      body: {},
    };
  };

  private createRefreshTokenCookie = (refreshToken: string) => {
    const options: CookieOptions = {
      httpOnly: true,
      maxAge: TokenExpirationTimes.RefreshToken * 1000,
    };
    if (this.globalEnv.environment === Environments.Prod) {
      options.sameSite = 'strict';
      options.secure = true;
    }
    return new Cookie(CookieNames.RefreshToken, refreshToken, options);
  };
}
