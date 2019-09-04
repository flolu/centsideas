import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaPublishedEvent extends Event<{}> {
  static readonly eventName = 'idea-published';

  constructor() {
    super(IdeaPublishedEvent.eventName, {});
  }

  static commit(state: Idea, _event: IdeaPublishedEvent): Idea {
    state.published = true;
    state.publishedAt = new Date().toISOString();
    return state;
  }
}
