export interface IAuthenticationDto {
  token: string;
}

export interface IConfirmEmailChangeDto {
  token: string;
}

export interface IUpdateUserDto {
  username: string | null;
  email: string | null;
}

export interface IConfirmSignUpDto {
  token: string;
}
