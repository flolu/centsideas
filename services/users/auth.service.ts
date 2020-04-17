import { injectable } from 'inversify';

import { HttpStatusCodes, CookieNames, TokenExpirationTimes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, Cookie, Dtos } from '@centsideas/models';
import { handleHttpResponseError, Logger } from '@centsideas/utils';

import env from './environment';
import { AuthCommandHandler } from './auth.command-handler';

@injectable()
export class AuthService {
  constructor(private commandHandler: AuthCommandHandler) {}

  login = (req: HttpRequest<Dtos.ILoginDto>) =>
    Logger.thread('login', async t => {
      try {
        const { email } = req.body;

        const createdLogin = await this.commandHandler.login(email, t);

        t.log('created login with id', createdLogin.persistedState.id);

        return { status: HttpStatusCodes.Accepted, body: {} };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  confirmLogin = (
    req: HttpRequest<Dtos.IConfirmLoginDto>,
  ): Promise<HttpResponse<Dtos.IConfirmedLoginDto>> =>
    Logger.thread('confirm login', async t => {
      try {
        const { loginToken } = req.body;

        const data = await this.commandHandler.confirmLogin(loginToken, t);

        const { user, accessToken, refreshToken } = data;
        const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);
        t.log('confirmed login of user', user.id);

        return {
          status: HttpStatusCodes.Accepted,
          body: { user, accessToken },
          cookies: [refreshTokenCookie],
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  googleLoginRedirect = (req: HttpRequest): Promise<HttpResponse<Dtos.IGoogleLoginRedirectDto>> =>
    Logger.thread('google login redirect', async t => {
      try {
        const origin = req.headers.origin;

        const url = this.commandHandler.googleLoginRedirect(origin);
        t.debug('generated google login url starting with', url.substr(0, 30));

        return { status: HttpStatusCodes.Accepted, body: { url } };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  googleLogin = (
    req: HttpRequest<Dtos.IGoogleLoginDto>,
  ): Promise<HttpResponse<Dtos.IGoogleLoggedInDto>> =>
    Logger.thread('google login', async t => {
      try {
        const { code } = req.body;
        const origin = req.headers.origin;
        t.debug('code starts with', code.substr(0, 20));

        const data = await this.commandHandler.googleLogin(code, t, origin);

        const { user, accessToken, refreshToken } = data;
        const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);
        t.log('successfully completed google login');

        return {
          status: HttpStatusCodes.Accepted,
          body: { user, accessToken },
          cookies: [refreshTokenCookie],
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  refreshToken = (req: HttpRequest): Promise<HttpResponse<Dtos.IRefreshedTokenDto>> =>
    Logger.thread('refresh token', async t => {
      try {
        let currentRefreshToken = req.cookies[CookieNames.RefreshToken];

        if (!currentRefreshToken) {
          const { exchangeSecret } = req.body;
          if (env.exchangeSecrets.frontendServer === exchangeSecret) {
            currentRefreshToken = req.body.refreshToken;
            t.debug('got token from trusted exchange from frontend server');
          }
        }

        const data = await this.commandHandler.refreshToken(currentRefreshToken, t);

        const { user, accessToken, refreshToken } = data;
        const refreshTokenCookie = this.createRefreshTokenCookie(refreshToken);
        t.log(`got new access token and refreshed refresh token of user ${user.persistedState.id}`);

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

        return handleHttpResponseError(error, t, { cookies: [clearRefreshTokenCookie] });
      }
    });
  logout = (_req: HttpRequest): Promise<HttpResponse<{}>> =>
    Logger.thread('logout', async t => {
      try {
        const clearRefreshTokenCookie = new Cookie(CookieNames.RefreshToken, '', { maxAge: 0 });

        return {
          status: HttpStatusCodes.Accepted,
          body: {},
          cookies: [clearRefreshTokenCookie],
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  // FIXME implement such that access to this controller is only for admins
  revokeRefreshToken = (req: HttpRequest): Promise<HttpResponse<{}>> =>
    Logger.thread('revoke refresh token', async t => {
      try {
        const { userId, reason } = req.body;
        await this.commandHandler.revokeRefreshToken(userId, reason, t);
        t.log(`successfully revoked refresh token of user ${userId}`);
        return {
          status: HttpStatusCodes.Accepted,
          body: {},
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  private createRefreshTokenCookie = (refreshToken: string) =>
    new Cookie(CookieNames.RefreshToken, refreshToken, {
      httpOnly: true,
      sameSite: env.environment === 'dev' ? 'none' : 'strict',
      secure: env.environment === 'dev' ? false : true,
      maxAge: TokenExpirationTimes.RefreshToken * 1000,
    });
}
