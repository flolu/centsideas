export interface IIdeaCreatedEvent {
  ideaId: string;
  userId: string;
  title: string;
  description: string;
}

export interface IIdeaUpdatedEvent {
  title?: string;
  description?: string;
}

export interface IIdeaDeletedEvent {}
