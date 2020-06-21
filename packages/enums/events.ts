export enum IdeaEventNames {
  Created = 'idea:created',
  Renamed = 'idea:renamed',
  DescriptionEdited = 'idea:descriptionEdited',
  TagsAdded = 'idea:tagsAdded',
  TagsRemoved = 'idea:tagsRemoved',
  Published = 'idea:published',
  Deleted = 'idea:deleted',
}

export enum AuthenticationEventNames {
  SignInRequested = 'authentication.session:signInRequested',
  SignInConfirmed = 'authentication.session:signInConfirmed',
  GoogleSignInConfirmed = 'authentication.session:googleSignInConfirmed',
  SignedOut = 'authentication.session:signedOut',
  TokensRefreshed = 'authentication.session:tokensRefreshed',
  RefreshTokenRevoked = 'authentication.session:refreshTokenRevoked',
}

export enum PrivateUserEventNames {
  Created = 'user.privateUser:created',
  EmailChangeRequested = 'user.privateUser:emailChangeRequested',
  EmailChangeConfirmed = 'user.privateUser:emailChangeConfirmed',
  Deleted = 'user.privateUser:deleted',
}

export enum UserEventNames {
  Created = 'user:created',
  Renamed = 'user:renamed',
  DeletionRequested = 'user:deletionRequested',
  DeletionConfirmed = 'user:deletionConfirmed',
}
