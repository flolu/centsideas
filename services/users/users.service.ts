import { injectable } from 'inversify';

import {
  HttpStatusCodes,
  HeaderKeys,
  CookieNames,
  UsersApiRoutes,
  ApiEndpoints,
} from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  ILoginDto,
  IAuthenticateDto,
  IAuthenticatedDto,
  IUpdateUserDto,
  IUserQueryDto,
  IUserState,
  IConfirmEmailChangeDto,
  IConfirmLoginDto,
  Cookie,
  IConfirmedLoginDto,
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

          const cookie: Cookie = {
            name: 'jwt',
            val: `awesome_token_value_${req.body.email}`,
            options: {},
            /*   options: {
              maxAge: 7 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              // domain: 'localhost',
              path: '/',
            }, */
          };

          resolve({
            status: HttpStatusCodes.Accepted,
            body: {},
            // TODO remove this is only for testing
            cookies: [cookie],
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

          const refreshTokenCookie: Cookie = {
            name: CookieNames.RefreshToken,
            val: refreshToken,
            options: {
              httpOnly: true,
              path: `/${ApiEndpoints.Users}/${UsersApiRoutes.RefreshToken}`,
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

  // TODO this route and dto should probably renamed to something like getMyUserData or so
  authenticate = (
    req: HttpRequest<null, null, null, IAuthenticateDto>,
  ): Promise<HttpResponse<IAuthenticatedDto>> =>
    new Promise(resolve => {
      Logger.thread('authenticate', async t => {
        try {
          const user = await this.commandHandler.authenticate(req.headers[HeaderKeys.Auth], t);
          t.log('user with id', user.id, 'authenticated');
          resolve({
            status: HttpStatusCodes.Accepted,
            body: { user },
            headers: {},
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
