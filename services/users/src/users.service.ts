import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';
import {
  ILoginDto,
  IConfirmLoginDto,
  IAuthenticationDto,
  IConfirmEmailChangeDto,
  IUpdateUserDto,
  IUserQueryDto,
} from './dtos';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler, private logger: Logger) {}

  login = (req: HttpRequest<ILoginDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      /**
       * if (email exists) {
       *  login
       * } else {
       *  send sign up email
       * }
       */
    });

  confirmLogin = (req: HttpRequest<IConfirmLoginDto>): Promise<HttpResponse<IAuthenticationDto>> =>
    new Promise(async resolve => {
      /**
       * check credentials
       * send new token if ok
       */
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
      /**
       * validate token, send success or fail response
       */
    });
}
