export namespace AuthWrite {
  export interface RefreshTokens {
    token: string
  }

  export interface Tokens {
    accessToken: string
    refreshToken: string
  }

  export interface RequestEmailSignIn {
    email: string
    sessionId: string
  }

  export interface ConfirmEmailSignIn {
    token: string
  }

  export interface GoogleSignIn {
    code: string
    sessionId: string
  }

  export interface SignOut {
    sessionId: string
  }
}
