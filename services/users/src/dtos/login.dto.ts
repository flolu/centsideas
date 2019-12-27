export interface ILoginDto {
  email: string;
}

export interface IAuthenticateDto {
  authorization: string;
}

export interface IAuthenticatedDto {
  token: string;
}
