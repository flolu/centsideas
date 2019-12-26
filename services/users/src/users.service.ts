import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';
import {
  ILoginDto,
  IAuthenticateDto,
  IConfirmEmailChangeDto,
  IUpdateUserDto,
  IUserQueryDto,
  IConfirmSignUpDto,
} from './dtos';
import { User } from './user.entity';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler, private logger: Logger) {}

  login = (req: HttpRequest<ILoginDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'login';
      try {
        this.logger.info(_loggerName);
        const result = await this.commandHandler.login(req.body.email);
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

  confirmSignUp = (req: HttpRequest<null, IConfirmSignUpDto>): Promise<HttpResponse<User>> =>
    new Promise(async resolve => {
      const _loggerName = 'confirm sign up';
      try {
        this.logger.info(_loggerName);
        const user = await this.commandHandler.confirmSignUp(req.params.token);
        resolve({
          status: HttpStatusCodes.Created,
          body: user,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  authenticate = (req: HttpRequest<null, IAuthenticateDto>): Promise<HttpResponse<IAuthenticateDto>> =>
    new Promise(async resolve => {
      const _loggerName = 'authenticate';
      try {
        this.logger.info(_loggerName);
        const updatedToken = await this.commandHandler.authenticate(req.params.token);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { token: updatedToken },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  updateUser = (req: HttpRequest<IUpdateUserDto, IUserQueryDto>): Promise<HttpResponse<any>> =>
    new Promise(async resolve => {
      const _loggerName = 'update user';
      try {
        this.logger.info(_loggerName);
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
      // TODO email change
    });
}
