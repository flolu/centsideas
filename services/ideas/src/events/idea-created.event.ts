import { Event } from '@cents-ideas/event-sourcing';
import { Idea, IIdeaState } from '../idea.entity';

export class IdeaCreatedEvent extends Event<{ ideaId: string }> {
  static readonly eventName: string = 'idea-crated';

  constructor(ideaId: string) {
    super(IdeaCreatedEvent.eventName, { ideaId }, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaCreatedEvent): IIdeaState {
    state.id = event.aggregateId;
    state.createdAt = new Date().toISOString();
    state.deleted = false;
    state.published = false;
    return state;
  }
}
