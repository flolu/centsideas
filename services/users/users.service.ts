import { injectable } from 'inversify';

import { HttpStatusCodes, HeaderKeys } from '@cents-ideas/enums';
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
} from '@cents-ideas/models';
import {
  Logger,
  handleHttpResponseError,
  NotAuthenticatedError,
  NoPermissionError,
} from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler, private logger: Logger) {}

  login = (req: HttpRequest<ILoginDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const t = this.logger.thread('login');
      try {
        const createdLogin = await this.commandHandler.login(req.body.email, t);
        t.log('created login with id', createdLogin.persistedState.id).complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: {},
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });

  authenticate = (
    req: HttpRequest<null, null, null, IAuthenticateDto>,
  ): Promise<HttpResponse<IAuthenticatedDto>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('authenticate');
      try {
        const { token, user } = await this.commandHandler.authenticate(
          req.headers[HeaderKeys.Auth],
          t,
        );
        t.log('user with id', user.id, 'authenticated').complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { token, user },
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });

  confirmLogin = (req: HttpRequest<IConfirmLoginDto>): Promise<HttpResponse<IAuthenticatedDto>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('confirm login');
      try {
        const { token, user } = await this.commandHandler.confirmLogin(req.body.token, t);
        t.log('confirmed login of user', user.id).complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { token, user },
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });

  updateUser = (
    req: HttpRequest<IUpdateUserDto, IUserQueryDto>,
  ): Promise<HttpResponse<IUserState>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('update user');
      try {
        const updatedUser = await this.commandHandler.updateUser(
          req.locals.userId,
          req.params.id,
          req.body.username,
          req.body.email,
          t,
        );
        t.log('updated user').complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });

  confirmEmailChange = (
    req: HttpRequest<IConfirmEmailChangeDto>,
  ): Promise<HttpResponse<IUserState>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('confirm email change');
      try {
        const updatedUser = await this.commandHandler.confirmEmailChange(req.body.token, t);
        t.log('confirmed email change').complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });
}
