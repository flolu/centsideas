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
