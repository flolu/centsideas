import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { IIdeaState } from '@cents-ideas/models';

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

export class Idea extends EventEntity<IIdeaState> {
  static initialState: IIdeaState = {
    id: '',
    title: '',
    description: '',
    createdAt: null,
    published: false,
    publishedAt: null,
    unpublishedAt: null,
    updatedAt: null,
    deleted: false,
    deletedAt: null,
    draft: null,
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<IIdeaState>) {
    super(commitFunctions, (snapshot && snapshot.state) || Idea.initialState);
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
