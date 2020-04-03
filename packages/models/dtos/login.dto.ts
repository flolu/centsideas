import { IUserState } from '../entities';

export interface ILoginDto {
  email: string;
}

export interface IAuthenticateDto {
  authorization: string;
}

export interface IAuthenticatedDto {
  token: string;
  user: IUserState;
}

export interface IConfirmLoginDto {
  token: string;
}
