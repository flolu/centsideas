export enum GenericErrors {
  Unexpected = 'unexpected',
  InvalidId = 'invalidId',
  InvalidEmail = 'invalidEmail',
  InvalidToken = 'invalidToken',
  InvalidTokenSecret = 'invalidTokenSecret',
  InvalidURL = 'invalidURL',
  NotSignedIn = 'notSignedIn',
  ConfigValueNotFound = 'configValueNotFound',
}

export enum EventSourcingErrors {
  InvalidEventName = 'eventSourcing.invalidEventName',
  OptimisticConcurrencyIssue = 'eventSourcing.optimisticConcurrencyIssue',
  EventNameForPayloadNotFound = 'eventSourcing.eventNameForPayloadNotFound',
  EmptyReplay = 'eventSourcing.emptyReplay',
  CannotFlushEmptyAggregate = 'eventSourcing.cannotFlushEmptyAggregate',
  InconsistentAggregateType = 'eventSourcing.inconsistentAggregateType',
  WrongChronologicalOrdering = 'eventSourcing.wrongChronologicalOrdering',
  SnapshotEventsVersionMismatch = 'eventSourcing.snapshotEventsVersionMismatch',
}

export enum SessionErrors {
  NotSignedIn = 'session.notSignedIn',
  Revoked = 'session.revoked',
}

export enum UserErrors {
  UsernameTooLong = 'user.usernameTooLong',
  UsernameTooShort = 'user.usernameTooShort',
  UsernameInvalid = 'user.usernameInvalid',
  DisplayNameTooLong = 'user.displayNameTooLong',
  BioTooLong = 'user.bioTooLong',
  LocationTooLong = 'user.locationTooLong',
  AlreadyDeleted = 'user.alreadyDeleted',
  NotFound = 'user.notFound',
  InvalidRole = 'user.invalidRole',
}
