import {GetEventsCommand} from '../common';

export interface RequestEmailSignIn {
  email: string;
}

export interface ConfirmEmailSignIn {
  signInToken: string;
}

export interface RefreshTokens {
  refreshToken: string;
}

export interface SignOut {
  refreshToken: string;
}

export interface RevokeRefreshToken {
  sessionId: string;
}

export interface AuthTokenResponse {
  refreshToken: string;
  accessToken: string;
  userId: string;
}

export interface Service {
  requestEmailSignIn: (payload: RequestEmailSignIn) => Promise<void>;
  confirmEmailSignIn: (payload: ConfirmEmailSignIn) => Promise<AuthTokenResponse>;
  refreshToken: (payload: RefreshTokens) => Promise<AuthTokenResponse>;
  signOut: (payload: SignOut) => Promise<void>;
  revokeRefreshToken: (payload: RevokeRefreshToken) => Promise<void>;

  getEvents: GetEventsCommand;
}
