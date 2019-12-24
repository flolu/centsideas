export interface ILoginDto {
  email: string;
}

export interface IConfirmLoginDto {
  token: string;
  key: string;
}

export interface IAuthenticationDto {
  token: string;
}
