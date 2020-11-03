export enum AuthApi {
  RequestEmailSignIn,
  ConfirmEmailSignIn,
  GoogleSignIn,
  RefreshTokens,
  SignOut,
}

export enum UserApi {
  Rename,
  UpdateProfile,
  ConfirmEmailChange,
  RequestDeletion,
  ConfirmDeletion,
  GetPublicEvents,
  GetPrivateEvents,
}
export enum UserReadApi {
  GetByUsername,
  GetByEmail,
  GetAll,
  GetMe,
}
