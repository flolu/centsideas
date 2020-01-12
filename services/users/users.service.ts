import { injectable } from 'inversify';

import { HttpStatusCodes, HeaderKeys } from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  ILoginResponseDto,
  ILoginDto,
  IAuthenticateDto,
  IAuthenticatedDto,
  IConfirmSignUpResponseDto,
  IConfirmEmailChangeDto,
  IUpdateUserDto,
  IUserQueryDto,
  IUserState,
} from '@cents-ideas/models';
import { Logger, handleHttpResponseError, NotAuthenticatedError, NoPermissionError } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler, private logger: Logger) {}

  login = (req: HttpRequest<ILoginDto>): Promise<HttpResponse<ILoginResponseDto>> =>
    new Promise(async resolve => {
      const _loggerName = 'login';
      try {
        this.logger.info(_loggerName);
        const result = await this.commandHandler.login(req.body.email);
        // FIXME don't send token back!... instead send email to user
        resolve({
          status: HttpStatusCodes.Accepted,
          body: result,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  confirmSignUp = (
    req: HttpRequest<null, null, null, IAuthenticateDto>,
  ): Promise<HttpResponse<IConfirmSignUpResponseDto>> =>
    new Promise(async resolve => {
      const _loggerName = 'confirm sign up';
      try {
        this.logger.info(_loggerName);
        const { user, token } = await this.commandHandler.confirmSignUp(req.headers[HeaderKeys.Auth]);
        resolve({
          status: HttpStatusCodes.Created,
          body: { user, token },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  authenticate = (req: HttpRequest<null, null, null, IAuthenticateDto>): Promise<HttpResponse<IAuthenticatedDto>> =>
    new Promise(async resolve => {
      const _loggerName = 'authenticate';
      try {
        this.logger.info(_loggerName);
        const { token, user } = await this.commandHandler.authenticate(req.headers[HeaderKeys.Auth]);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { token, user },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  updateUser = (req: HttpRequest<IUpdateUserDto, IUserQueryDto>): Promise<HttpResponse<IUserState>> =>
    new Promise(async resolve => {
      const _loggerName = 'update user';
      try {
        this.logger.info(_loggerName);
        NotAuthenticatedError.validate(req.locals.userId);
        NoPermissionError.validate(req.locals.userId, req.params.id);
        const updatedUser = await this.commandHandler.updateUser(req.params.id, req.body.username, req.body.email);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: updatedUser.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  confirmEmailChange = (req: HttpRequest<IConfirmEmailChangeDto>): Promise<HttpResponse<any>> =>
    new Promise(async resolve => {
      // FIXME email change
    });
}
