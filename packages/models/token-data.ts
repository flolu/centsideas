export interface ILoginTokenPayload {
  loginId: string;
  email: string;
  firstLogin: boolean;
}

export interface IAuthTokenPayload {
  userId: string;
}

export interface ITokenData {
  type: 'auth' | 'login';
  payload: IAuthTokenPayload | ILoginTokenPayload;
}

export interface ITokenDataFull extends ITokenData {
  iat: number;
  exp: number;
}
