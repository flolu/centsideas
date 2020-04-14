export enum TokenExpirationTimes {
  LoginToken = 2 * 60 * 60,
  // TODO remove
  UntilGenerateNew = 1 * 24 * 60 * 60,
  // TODO remove
  AuthToken = 7 * 24 * 60 * 60,
  EmailChangeToken = 2 * 60 * 60,
  RefreshToken = 7 * 24 * 60 * 60,
  AccessToken = 15 * 60,
}
