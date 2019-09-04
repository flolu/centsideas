import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaUnpublishedEvent extends Event<{}> {
  static readonly eventName = 'idea-unpublished';

  constructor() {
    super(IdeaUnpublishedEvent.eventName, {});
  }

  static commit(state: Idea, _event: IdeaUnpublishedEvent): Idea {
    state.published = false;
    state.unpublishedAt = new Date().toISOString();
    return state;
  }
}
