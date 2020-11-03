export enum SessionEvents {
  Started = 'session:started',
  EmailSignInRequested = 'session:emailSignInRequested',
  EmailSignInConfirmed = 'session:emailSignInConfirmed',
  GoogleSignInConfirmed = 'session:googleSignInConfirmed',
  TokensRefreshed = 'session:tokensRefreshed',
  RefreshTokenRevoked = 'session:refreshTokenRevoked',
  SignedOut = 'session:signedOut',
}

export enum UserEvents {
  Created = 'user:created',
  Renamed = 'user:renamed',
  RoleChanged = 'user:roleUpdated',
  DeletionRequested = 'user:deletionRequested',
  DeletionConfirmed = 'user:deletionConfirmed',
}

export enum PrivateUserEvents {
  Created = 'privateUser:created',
  AvatarChanged = 'privateUser:avatarChanged',
  DisplayNameChanged = 'privateUser:diaplayNameChanged',
  BioUpdated = 'privateUser:bioUpdated',
  LocationChanged = 'privateUser:locationChanged',
  WebsiteChanged = 'privateUser:websiteChanged',
  EmailChangeRequested = 'privateUser:emailChangeRequested',
  EmailChangeConfirmed = 'privateUser:emailChangeConfirmed',
  Deleted = 'privateUser:deleted',
}
