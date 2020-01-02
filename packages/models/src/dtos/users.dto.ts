import { IUserState } from '../entities';

export interface IConfirmSignUpResponseDto {
  user: IUserState;
  token: string;
}

export interface IAuthenticationDto {
  token: string;
}

export interface IConfirmEmailChangeDto {
  token: string;
}

export interface IUpdateUserDto {
  username: string;
  email: string;
}

export interface IUserQueryDto {
  id: string;
}

export interface IConfirmSignUpDto {
  token: string;
}

export interface IAuthTokenData {
  userId: string;
}
