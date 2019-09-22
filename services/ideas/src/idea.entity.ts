import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';

import {
  IdeaCreatedEvent,
  IdeaDraftSavedEvent,
  IdeaDraftDiscardedEvent,
  IdeaDraftCommittedEvent,
  IdeaPublishedEvent,
  IdeaUpdatedEvent,
  IdeaUnpublishedEvent,
  IdeaDeletedEvent,
  commitFunctions,
} from './events';
import { IdeaNotFoundError } from './errors';

export interface IIdeaState {
  id: string;
  title: string;
  description: string;
  createdAt: string | null;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  draft: { title: string | null; description: string | null } | null;
}

export class Idea extends EventEntity<IIdeaState> {
  static initialState: IIdeaState = {
    id: null,
    title: null,
    description: null,
    createdAt: null,
    published: false,
    publishedAt: null,
    unpublishedAt: null,
    updatedAt: null,
    deleted: false,
    deletedAt: null,
    draft: null,
  };

  constructor(snapshot?: ISnapshot<IIdeaState>) {
    super(commitFunctions, (snapshot && snapshot.state) || Idea.initialState, IdeaNotFoundError);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }

  static create(ideaId: string): Idea {
    const idea = new Idea();
    idea.pushEvents(new IdeaCreatedEvent(ideaId));
    return idea;
  }

  saveDraft(title?: string, description?: string) {
    this.pushEvents(new IdeaDraftSavedEvent(this.persistedState.id, title, description));
    return this;
  }

  discardDraft() {
    this.pushEvents(new IdeaDraftDiscardedEvent(this.persistedState.id));
    return this;
  }

  commitDraft() {
    this.pushEvents(new IdeaDraftCommittedEvent(this.persistedState.id));
    return this;
  }

  publish(): Idea {
    this.pushEvents(new IdeaPublishedEvent(this.persistedState.id));
    return this;
  }

  update(title?: string, description?: string): Idea {
    this.pushEvents(new IdeaUpdatedEvent(this.persistedState.id, title, description));
    return this;
  }

  unpublish(): Idea {
    this.pushEvents(new IdeaUnpublishedEvent(this.persistedState.id));
    return this;
  }

  delete(): Idea {
    this.pushEvents(new IdeaDeletedEvent(this.persistedState.id));
    return this;
  }
}
