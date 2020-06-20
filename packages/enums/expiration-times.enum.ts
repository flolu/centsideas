export enum TokenExpirationTimes {
  SignIn = 2 * 60 * 60,
  EmailChange = 2 * 60 * 60,
  UserDeletion = 8 * 60 * 60,
  Refresh = 7 * 24 * 60 * 60,
  Access = 15 * 60,
}
