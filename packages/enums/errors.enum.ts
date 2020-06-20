export enum GenericErrorNames {
  Unexpected = 'unexpected',
  InvalidAuthToken = 'invalidAuthToken',
  InvalidEmail = 'invalidEmail',
  InvalidId = 'invalidId',
  InvalidToken = 'invalidToken',
}

export enum EventSourcingErrorNames {
  OptimisticConcurrencyIssue = 'eventsourcing.optimisticConcurrency',
  ReplayVersionMismatch = 'eventsourcing.replayVersionMismatch',
}

export enum IdeaErrorNames {
  TitleTooShort = 'idea.titleTooShort',
  TitleTooLong = 'idea.titleTooLong',
  TitleRequired = 'idea.titleRequired',
  AlreadyDeleted = 'idea.alreadyDeleted',
  AlreadyPublished = 'idea.alreadyPublished',
  DescriptionTooLong = 'idea.descriptionTooLong',
  TagTooLong = 'idea.tagTooLong',
  TagTooShort = 'idea.tagTooShort',
  ToManyTags = 'idea.tooManyTags',
  NoPermission = 'idea.noPermission',
}

// TODO merge with idea error names
export enum IdeaReadErrorNames {
  NotFound = 'idea.notFound',
}

export enum AuthenticationErrorNames {
  SessionAlreadyConfirmed = 'authentication.session.alreadyConfirmed',
  SessionRevoked = 'authentication.session.sessionRevoked',
  SessionSignedOut = 'authentication.session.sessionSignedOut',
  SessionUnconfirmed = 'authentication.session.sessionUnconfirmed',
}

export enum UserErrorNames {
  UsernameTooLong = 'user.usernameTooLong',
  UsernameTooShort = 'user.usernameTooShort',
  UsernameInvalid = 'user.usernameInvalid',
  AlreadyDeleted = 'user.alreadyDeleted',
  NoPermission = 'user.noPermssion',
  UserDeletionMustBeRequested = 'user.userDeletionMustBeRequested',
  NotFound = 'user.notFound',
}
