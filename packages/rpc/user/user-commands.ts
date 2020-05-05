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

// TODO would be great to use this as an class interface for handlers... but it doesn't infer method argument tyepes?!
export interface IUserCommands {
  update: UpdateUser;
  confirmEmailChange: ConfirmEmailChange;
}
