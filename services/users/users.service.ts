import { injectable } from 'inversify';

import { HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, IUserState, Dtos } from '@centsideas/models';
import { handleHttpResponseError, Logger } from '@centsideas/utils';

import { UsersHandler } from './users.handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UsersHandler) {}

  updateUser = (req: HttpRequest<Dtos.IUpdateUserDto>): Promise<HttpResponse<IUserState>> =>
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
        return handleHttpResponseError(error, t);
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
        return handleHttpResponseError(error, t);
      }
    });
}
