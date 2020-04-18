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

export interface IRefreshedTokenDto {
  user: IUserState | null;
  accessToken: string;
  ok: boolean;
}

export interface IGoogleLoginDto {
  code: string;
}

export interface IGoogleLoginRedirectDto {
  url: string;
}

export interface IGoogleLoggedInDto {
  user: IUserState;
  accessToken: string;
}
