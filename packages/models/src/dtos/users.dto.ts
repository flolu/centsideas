import { IUserState } from '../entities';

export interface IConfirmSignUpResponseDto {
  user: IUserState;
  token: string;
}
