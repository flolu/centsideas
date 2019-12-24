import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';
import { ILoginDto, IConfirmLoginDto, IAuthenticationDto } from './dtos/login.dto';

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

  reAuthenticate = (req: HttpRequest<null, IAuthenticationDto>): Promise<HttpResponse<IAuthenticationDto>> =>
    new Promise(async resolve => {
      /**
       * check token valid?
       * send new token if ok
       */
    });
}
