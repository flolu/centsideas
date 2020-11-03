export enum TokenExpiration {
  Access = 15 * 60,
  Refresh = 7 * 24 * 60 * 60,
  EmailSignIn = 2 * 60 * 60,
  ChangeEmail = 4 * 60 * 60,
  UserDeletion = 1 * 60 * 60,
}
