export interface INativeTokenData {
  iat: number;
  exp: number;
}

export interface IRefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export interface ILoginTokenPayload {
  loginId: string;
  email: string;
  firstLogin: boolean;
}

export interface IAccessTokenPayload {
  userId: string;
}

export interface IEmailChangeTokenPayload {
  currentEmail: string;
  newEmail: string;
  userId: string;
}

export interface ILoginTokenPayload {
  loginId: string;
  firstLogin: boolean;
}
