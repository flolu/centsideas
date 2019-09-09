import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaDraftDiscardedEvent extends Event<void> {
  static readonly eventName = 'idea-draft-discarded';

  constructor() {
    super(IdeaDraftDiscardedEvent.eventName);
  }

  static commit(state: Idea): Idea {
    state.draft = { title: null, description: null };
    return state;
  }
}
