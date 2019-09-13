import { EventEntity } from '@cents-ideas/event-sourcing';
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

export class Idea extends EventEntity<Idea> {
  public id: string = '';
  public title: string = '';
  public description: string = '';
  public createdAt: string | null = null;
  public published: boolean = false;
  public publishedAt: string | null = null;
  public unpublishedAt: string | null = null;
  public updatedAt: string | null = null;
  public deleted: boolean = false;
  public deletedAt: string | null = null;
  public draft: { title: string | null; description: string | null } | null = null;

  constructor() {
    super(commitFunctions);
  }

  static create(ideaId: string): Idea {
    const idea = new Idea();
    idea.pushNewEvents([new IdeaCreatedEvent(ideaId)]);
    return idea;
  }

  saveDraft(title?: string, description?: string) {
    this.pushNewEvents([new IdeaDraftSavedEvent(this.id, title, description)]);
    return this;
  }

  discardDraft() {
    this.pushNewEvents([new IdeaDraftDiscardedEvent(this.id)]);
    return this;
  }

  commitDraft(title?: string, description?: string) {
    this.pushNewEvents([new IdeaDraftCommittedEvent(this.id, title, description)]);
    return this;
  }

  publish(): Idea {
    this.pushNewEvents([new IdeaPublishedEvent(this.id)]);
    return this;
  }

  update(title?: string, description?: string): Idea {
    this.pushNewEvents([new IdeaUpdatedEvent(this.id, title, description)]);
    return this;
  }

  unpublish(): Idea {
    this.pushNewEvents([new IdeaUnpublishedEvent(this.id)]);
    return this;
  }

  delete(): Idea {
    this.pushNewEvents([new IdeaDeletedEvent(this.id)]);
    return this;
  }

  get state() {
    // FIXME start from current state?
    const currentState = this.reducer.reduce(new Idea(), [...this.persistedEvents, ...this.pendingEvents]);
    return {
      id: currentState.id,
      title: currentState.title,
      description: currentState.description,
      createdAt: currentState.createdAt,
      published: currentState.published,
      publishedAt: currentState.publishedAt,
      unpublishedAt: currentState.unpublishedAt,
      updatedAt: currentState.updatedAt,
      deleted: currentState.deleted,
      deletedAt: currentState.deletedAt,
      draft: currentState.draft,
    };
  }
}
