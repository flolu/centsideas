import { injectable } from 'inversify';

import { HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, IUserState, Dtos } from '@centsideas/models';
import { handleHttpResponseError } from '@centsideas/utils';

import { UsersHandler } from './users.handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UsersHandler) {}

  updateUser = async (req: HttpRequest<Dtos.IUpdateUserDto>): Promise<HttpResponse<IUserState>> => {
    try {
      const auid = req.locals.userId;
      const userId = req.params.id;
      const { username, email } = req.body;

      const updatedUser = await this.commandHandler.updateUser(auid, userId, username, email);

      return {
        status: HttpStatusCodes.Accepted,
        body: updatedUser.persistedState,
      };
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };

  confirmEmailChange = async (
    req: HttpRequest<Dtos.IConfirmEmailChangeDto>,
  ): Promise<HttpResponse<IUserState>> => {
    try {
      const { token } = req.body;

      const updatedUser = await this.commandHandler.confirmEmailChange(token);

      return {
        status: HttpStatusCodes.Accepted,
        body: updatedUser.persistedState,
      };
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };
}
