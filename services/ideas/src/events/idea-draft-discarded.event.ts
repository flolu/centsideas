import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaDraftDiscardedEvent extends Event<{}> {
  static readonly eventName = 'idea-draft-discarded';

  constructor(ideaId: string) {
    super(IdeaDraftDiscardedEvent.eventName, {}, ideaId);
  }

  static commit(state: Idea): Idea {
    state.draft = { title: null, description: null };
    return state;
  }
}
