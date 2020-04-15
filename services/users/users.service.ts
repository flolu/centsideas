import { injectable } from 'inversify';

import { HttpStatusCodes, CookieNames, UsersApiRoutes, ApiEndpoints } from '@cents-ideas/enums';
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
} from '@cents-ideas/models';
import { handleHttpResponseError, Logger } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler) {}

  login = (req: HttpRequest<ILoginDto>): Promise<HttpResponse> =>
    // TODO do i need promises here... or can i just create an async function that returns a value (would be cleaner)
    new Promise(resolve => {
      Logger.thread('login', async t => {
        try {
          const createdLogin = await this.commandHandler.login(req.body.email, t);
          t.log('created login with id', createdLogin.persistedState.id);

          resolve({
            status: HttpStatusCodes.Accepted,
            body: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  confirmLogin = (req: HttpRequest<IConfirmLoginDto>): Promise<HttpResponse<IConfirmedLoginDto>> =>
    new Promise(resolve => {
      Logger.thread('confirm login', async t => {
        try {
          const data = await this.commandHandler.confirmLogin(req.body.loginToken, t);
          const { user, accessToken, refreshToken } = data;

          // TODO util fucnction
          const refreshTokenCookie: Cookie = {
            name: CookieNames.RefreshToken,
            val: refreshToken,
            options: {
              httpOnly: true,
              path: `/${ApiEndpoints.Users}/${UsersApiRoutes.RefreshToken}`,
              sameSite: 'strict',
            },
          };

          t.log('confirmed login of user', user.id);
          resolve({
            status: HttpStatusCodes.Accepted,
            body: { user, accessToken },
            cookies: [refreshTokenCookie],
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  // TODO type
  refreshToken = (req: HttpRequest): Promise<HttpResponse<IRefreshedTokenDto>> =>
    new Promise(resolve => {
      Logger.thread('refresh token', async t => {
        try {
          const currentRefreshToken = req.cookies[CookieNames.RefreshToken];
          const data = await this.commandHandler.refreshToken(currentRefreshToken, t);
          const { user, accessToken, refreshToken } = data;

          // TODO util fucnction or class
          const refreshTokenCookie: Cookie = {
            name: CookieNames.RefreshToken,
            val: refreshToken,
            options: {
              httpOnly: true,
              path: `/${ApiEndpoints.Users}/${UsersApiRoutes.RefreshToken}`,
            },
          };

          t.log(
            'generated new access token and refreshed refresh token of user',
            user.persistedState.id,
          );
          resolve({
            status: HttpStatusCodes.Accepted,
            body: { user: user.persistedState, accessToken },
            cookies: [refreshTokenCookie],
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  updateUser = (
    req: HttpRequest<IUpdateUserDto, IUserQueryDto>,
  ): Promise<HttpResponse<IUserState>> =>
    new Promise(resolve => {
      Logger.thread('update user', async t => {
        try {
          const updatedUser = await this.commandHandler.updateUser(
            req.locals.userId,
            req.params.id,
            req.body.username,
            req.body.email,
            t,
          );
          t.log('updated user');
          resolve({
            status: HttpStatusCodes.Accepted,
            body: updatedUser.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  confirmEmailChange = (
    req: HttpRequest<IConfirmEmailChangeDto>,
  ): Promise<HttpResponse<IUserState>> =>
    new Promise(resolve => {
      Logger.thread('confirm email change', async t => {
        try {
          const updatedUser = await this.commandHandler.confirmEmailChange(req.body.token, t);
          t.log('confirmed email change');
          resolve({
            status: HttpStatusCodes.Accepted,
            body: updatedUser.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });
}
