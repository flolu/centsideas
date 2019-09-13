import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaCreatedEvent extends Event<{ ideaId: string }> {
  static readonly eventName = 'idea-crated';

  constructor(ideaId: string) {
    super(IdeaCreatedEvent.eventName, { ideaId }, ideaId);
  }

  static commit(state: Idea, event: IdeaCreatedEvent): Idea {
    state.id = event.aggregateId;
    state.createdAt = new Date().toISOString();
    state.deleted = false;
    state.published = false;
    return state;
  }
}
