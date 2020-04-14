import { IUserState } from '../entities';

export interface ILoginDto {
  email: string;
}

export interface IAuthenticateDto {
  authorization: string;
}

export interface IAuthenticatedDto {
  user: IUserState;
}

export interface IConfirmLoginDto {
  loginToken: string;
}

export interface IConfirmedLoginDto {
  user: IUserState;
  accessToken: string;
}
