import { injectable } from 'inversify';

import { HttpStatusCodes, CookieNames, TokenExpirationTimes } from '@cents-ideas/enums';
// TODO export groups to prevent long import lists like this one
import {
  HttpRequest,
  HttpResponse,
  ILoginDto,
  IUpdateUserDto,
  IUserQueryDto,
  IUserState,
  IConfirmEmailChangeDto,
  IConfirmLoginDto,
  Cookie,
  IConfirmedLoginDto,
  IRefreshedTokenDto,
  IGoogleLoginRedirectDto,
  IGoogleLoggedInDto,
  IGoogleLoginDto,
} from '@cents-ideas/models';
import { handleHttpResponseError, Logger } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';
import env from './environment';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler) {}

  login = (req: HttpRequest<ILoginDto>) =>
    Logger.thread('login', async t => {
      try {
        const { email } = req.body;

        const createdLogin = await this.commandHandler.login(email, t);

        t.log('created login with id', createdLogin.persistedState.id);

        return { status: HttpStatusCodes.Accepted, body: {} };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  confirmLogin = (req: HttpRequest<IConfirmLoginDto>): Promise<HttpResponse<IConfirmedLoginDto>> =>
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
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  googleLoginRedirect = (req: HttpRequest): Promise<HttpResponse<IGoogleLoginRedirectDto>> =>
    Logger.thread('google login redirect', async t => {
      try {
        const origin = req.headers.origin;

        const url = this.commandHandler.googleLoginRedirect(origin);
        t.debug('generated google login url starting with', url.substr(0, 30));

        return { status: HttpStatusCodes.Accepted, body: { url } };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  googleLogin = (req: HttpRequest<IGoogleLoginDto>): Promise<HttpResponse<IGoogleLoggedInDto>> =>
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
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  refreshToken = (req: HttpRequest): Promise<HttpResponse<IRefreshedTokenDto>> =>
    Logger.thread('refresh token', async t => {
      try {
        let currentRefreshToken = req.cookies[CookieNames.RefreshToken];
        if (!currentRefreshToken) {
          // TODO only if the request came from the ssr frontend server
          currentRefreshToken = req.body.refreshToken;
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

        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error, { cookies: [clearRefreshTokenCookie] });
      }
    });

  updateUser = (
    req: HttpRequest<IUpdateUserDto, IUserQueryDto>,
  ): Promise<HttpResponse<IUserState>> =>
    Logger.thread('update user', async t => {
      try {
        const auid = req.locals.userId;
        const userId = req.params.id;
        const { username, email } = req.body;

        const updatedUser = await this.commandHandler.updateUser(auid, userId, username, email, t);
        t.log('updated user');

        return {
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
        };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  confirmEmailChange = (
    req: HttpRequest<IConfirmEmailChangeDto>,
  ): Promise<HttpResponse<IUserState>> =>
    Logger.thread('confirm email change', async t => {
      try {
        const { token } = req.body;

        const updatedUser = await this.commandHandler.confirmEmailChange(token, t);
        t.log('confirmed email change');

        return {
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
        };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
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
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
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
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
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
