import { EventEntity } from '@cents-ideas/event-sourcing';
import { IdeaCreatedEvent } from './events/idea-created.event';
import { IdeaDeletedEvent } from './events/idea-deleted.event';
import { IdeaDraftSavedEvent } from './events/idea-draft-saved.event';
import { IdeaPublishedEvent } from './events/idea-published.event';
import { IdeaUnpublishedEvent } from './events/idea-unpublished.events';
import { IdeaUpdatedEvent } from './events/idea-updated.event';

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

  constructor() {
    // FIXME simplify
    super({
      [IdeaCreatedEvent.eventName]: IdeaCreatedEvent.commit,
      [IdeaDraftSavedEvent.eventName]: IdeaDraftSavedEvent.commit,
      [IdeaUpdatedEvent.eventName]: IdeaUpdatedEvent.commit,
      [IdeaPublishedEvent.eventName]: IdeaPublishedEvent.commit,
      [IdeaUnpublishedEvent.eventName]: IdeaUnpublishedEvent.commit,
      [IdeaDeletedEvent.eventName]: IdeaDeletedEvent.commit,
    });
  }

  static create(ideaId: string): Idea {
    const idea = new Idea();
    idea.pushNewEvents([new IdeaCreatedEvent(ideaId)]);
    return idea;
  }

  saveDraft(title?: string, description?: string) {
    this.pushNewEvents([new IdeaDraftSavedEvent(title, description)]);
    return this;
  }

  publish(): Idea {
    this.pushNewEvents([new IdeaPublishedEvent()]);
    return this;
  }

  update(title?: string, description?: string): Idea {
    this.pushNewEvents([new IdeaUpdatedEvent(title, description)]);
    return this;
  }

  unpublish(): Idea {
    this.pushNewEvents([new IdeaUnpublishedEvent()]);
    return this;
  }

  delete(): Idea {
    this.pushNewEvents([new IdeaDeletedEvent()]);
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
    };
  }
}
