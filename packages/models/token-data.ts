export interface ILoginTokenPayload {
  loginId: string;
  email: string;
  firstLogin: boolean;
}

export interface IAuthTokenPayload {
  userId: string;
}

export interface IEmailChangeTokenPayload {
  currentEmail: string;
  newEmail: string;
  userId: string;
}

export interface ITokenData {
  type: 'auth' | 'login' | 'email-change';
  payload: IAuthTokenPayload | ILoginTokenPayload | IEmailChangeTokenPayload;
}

export interface ITokenDataFull extends ITokenData {
  iat: number;
  exp: number;
}
