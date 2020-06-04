export enum GenericErrorNames {
  Unexpected = 'unexpected',
  InvalidAuthToken = 'invalidAuthToken',
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

export enum IdeaReadErrorNames {
  NotFound = 'idea.notFound',
}

export enum EventSourcingErrorNames {
  OptimisticConcurrencyIssue = 'eventsourcing.optimisticConcurrency',
  ReplayVersionMismatch = 'eventsourcing.replayVersionMismatch',
}
