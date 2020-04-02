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
      const _loggerName = 'login';
      try {
        this.logger.debug(_loggerName);
        await this.commandHandler.login(req.body.email);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: {},
          headers: {},
        });
      } catch (error) {
        this.logger.error(
          _loggerName,
          error.status && error.status < 500 ? error.message : error.stack,
        );
        resolve(handleHttpResponseError(error));
      }
    });

  authenticate = (
    req: HttpRequest<null, null, null, IAuthenticateDto>,
  ): Promise<HttpResponse<IAuthenticatedDto>> =>
    new Promise(async resolve => {
      const _loggerName = 'authenticate';
      try {
        this.logger.debug(_loggerName, `${req.headers[HeaderKeys.Auth].slice(0, 10)}...`);
        const { token, user } = await this.commandHandler.authenticate(
          req.headers[HeaderKeys.Auth],
        );
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { token, user },
          headers: {},
        });
      } catch (error) {
        this.logger.error(
          _loggerName,
          error.status && error.status < 500 ? error.message : error.stack,
        );
        resolve(handleHttpResponseError(error));
      }
    });

  updateUser = (
    req: HttpRequest<IUpdateUserDto, IUserQueryDto>,
  ): Promise<HttpResponse<IUserState>> =>
    new Promise(async resolve => {
      const _loggerName = 'update user';
      try {
        this.logger.debug(_loggerName, req);
        NotAuthenticatedError.validate(req.locals.userId);
        NoPermissionError.validate(req.locals.userId, req.params.id);
        const updatedUser = await this.commandHandler.updateUser(
          req.params.id,
          req.body.username,
          req.body.email,
        );
        resolve({
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(
          _loggerName,
          error.status && error.status < 500 ? error.message : error.stack,
        );
        resolve(handleHttpResponseError(error));
      }
    });

  confirmEmailChange = (
    req: HttpRequest<IConfirmEmailChangeDto>,
  ): Promise<HttpResponse<IUserState>> =>
    new Promise(async resolve => {
      const _loggerName = 'confirm email change';
      try {
        this.logger.debug(_loggerName, req);
        const updatedUser = await this.commandHandler.confirmEmailChange(req.body.token);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(
          _loggerName,
          error.status && error.status < 500 ? error.message : error.stack,
        );
        resolve(handleHttpResponseError(error));
      }
    });
}
