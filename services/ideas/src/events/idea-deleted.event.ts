import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaDeletedEvent extends Event<{}> {
  static readonly eventName = 'idea-deleted';

  constructor(ideaId: string) {
    super(IdeaDeletedEvent.eventName, {}, ideaId);
  }

  static commit(state: Idea, _event: IdeaDeletedEvent): Idea {
    state.deleted = true;
    state.deletedAt = new Date().toISOString();
    return state;
  }
}
