import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse, IUserState, Dtos } from '@cents-ideas/models';
import { handleHttpResponseError, Logger } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler) {}

  updateUser = (
    req: HttpRequest<Dtos.IUpdateUserDto, Dtos.IUserQueryDto>,
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
    req: HttpRequest<Dtos.IConfirmEmailChangeDto>,
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
}
