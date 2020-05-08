import { IUserState } from '@centsideas/models';

interface IUpdateUserCommand {
  username: string;
  email: string;
  userId: string;
}

interface IConfirmEmailChangeCommand {
  token: string;
  userId: string;
}

export type UpdateUser = (payload: IUpdateUserCommand) => Promise<IUserState>;
export type ConfirmEmailChange = (payload: IConfirmEmailChangeCommand) => Promise<IUserState>;

export interface IUserCommands {
  update: UpdateUser;
  confirmEmailChange: ConfirmEmailChange;
}
