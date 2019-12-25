export interface IIdeaCreatedEvent {
  ideaId: string;
}

export interface IIdeaDraftSavedEvent {
  title?: string;
  description?: string;
}

export interface IIdeaUpdatedEvent {
  title?: string;
  description?: string;
}

export interface IIdeaDeletedEvent {}
export interface IIdeaDraftCommittedEvent {}
export interface IIdeaDraftDiscardedEvent {}
export interface IIdeaPublishedEvent {}
export interface IIdeaUnpublishedEvent {}
