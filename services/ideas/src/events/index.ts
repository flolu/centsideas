import { KnownEvents } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';
import { IdeaCreatedEvent } from './idea-created.event';
import { IdeaDeletedEvent } from './idea-deleted.event';
import { IdeaDraftCommittedEvent } from './idea-draft-committed.event';
import { IdeaDraftDiscardedEvent } from './idea-draft-discarded.event';
import { IdeaDraftSavedEvent } from './idea-draft-saved.event';
import { IdeaPublishedEvent } from './idea-published.event';
import { IdeaUnpublishedEvent } from './idea-unpublished.events';
import { IdeaUpdatedEvent } from './idea-updated.event';

export const commitFunctions: KnownEvents<Idea> = {
  [IdeaCreatedEvent.eventName]: IdeaCreatedEvent.commit,
  [IdeaDeletedEvent.eventName]: IdeaDeletedEvent.commit,
  [IdeaDraftCommittedEvent.eventName]: IdeaDraftCommittedEvent.commit,
  [IdeaDraftDiscardedEvent.eventName]: IdeaDraftDiscardedEvent.commit,
  [IdeaDraftSavedEvent.eventName]: IdeaDraftSavedEvent.commit,
  [IdeaPublishedEvent.eventName]: IdeaPublishedEvent.commit,
  [IdeaUnpublishedEvent.eventName]: IdeaUnpublishedEvent.commit,
  [IdeaUpdatedEvent.eventName]: IdeaUpdatedEvent.commit,
};

export { IdeaCreatedEvent } from './idea-created.event';
export { IdeaDeletedEvent } from './idea-deleted.event';
export { IdeaDraftCommittedEvent } from './idea-draft-committed.event';
export { IdeaDraftDiscardedEvent } from './idea-draft-discarded.event';
export { IdeaDraftSavedEvent } from './idea-draft-saved.event';
export { IdeaPublishedEvent } from './idea-published.event';
export { IdeaUnpublishedEvent } from './idea-unpublished.events';
export { IdeaUpdatedEvent } from './idea-updated.event';
