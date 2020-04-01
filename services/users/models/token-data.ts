export interface ITokenData {
  email: string;
  userId: string | null;
  firstLogin: boolean;
}

export interface IFullTokenData extends ITokenData {
  iat: number;
  exp: number;
}
