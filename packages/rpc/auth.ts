import {IUserState} from '@centsideas/models';

interface ILoginCommand {
  email: string;
}

interface IConfirmLoginCommand {
  token: string;
}

interface IGoogleLoginCommand {
  code: string;
}

interface ILogoutCommand {
  userId: string;
}

interface IRefreshTokenCommand {
  refreshToken: string;
}

interface IAuthSuccessCredentials {
  user: IUserState;
  accessToken: string;
  refreshToken: string;
}

interface IGoogleLoginUrl {
  url: string;
}

export type LoginHandler = (payload: ILoginCommand) => Promise<any>;
export type ConfirmLogin = (payload: IConfirmLoginCommand) => Promise<IAuthSuccessCredentials>;
export type GoogleLogin = (payload: IGoogleLoginCommand) => Promise<IAuthSuccessCredentials>;
export type GoogleLoginRedicrect = (payload: any) => Promise<IGoogleLoginUrl>;
export type Logout = (payload: ILogoutCommand) => Promise<any>;
export type RefreshToken = (payload: IRefreshTokenCommand) => Promise<IAuthSuccessCredentials>;

export interface IAuthCommands {
  login: LoginHandler;
  confirmLogin: ConfirmLogin;
  googleLogin: GoogleLogin;
  googleLoginRedirect: GoogleLoginRedicrect;
  logout: Logout;
  refreshToken: RefreshToken;
}
