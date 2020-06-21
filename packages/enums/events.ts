export enum IdeaEventNames {
  Created = 'idea.created',
  Renamed = 'idea.renamed',
  DescriptionEdited = 'idea.descriptionEdited',
  TagsAdded = 'idea.tagsAdded',
  TagsRemoved = 'idea.tagsRemoved',
  Published = 'idea.published',
  Deleted = 'idea.deleted',
}

export enum AuthenticationEventNames {
  SignInRequested = 'authentication.session.signInRequested',
  SignInConfirmed = 'authentication.session.signInConfirmed',
  GoogleSignInConfirmed = 'authentication.session.googleSignInConfirmed',
  SignedOut = 'authentication.session.signedOut',
  TokensRefreshed = 'authentication.session.tokensRefreshed',
  RefreshTokenRevoked = 'authentication.session.refreshTokenRevoked',
}

// TODO refactor to namespace.aggregate.eventName (all event names)
export enum PrivateUserEventNames {
  Created = 'privateUser.created',
  EmailChangeRequested = 'privateUser.emailChangeRequested',
  EmailChangeConfirmed = 'privateUser.emailChangeConfirmed',
  Deleted = 'privateUser.deleted',
}

export enum UserEventNames {
  Created = 'user.created',
  Renamed = 'user.renamed',
  DeletionRequested = 'user.deletionRequested',
  DeletionConfirmed = 'user.deletionConfirmed',
}
