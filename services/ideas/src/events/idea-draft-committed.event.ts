import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaDraftCommittedEvent extends Event<{
  title?: string;
  description?: string;
}> {
  static readonly eventName = 'idea-draft-committed';

  constructor(title?: string, description?: string) {
    super(IdeaDraftCommittedEvent.eventName, { title, description });
  }

  static commit(state: Idea, { data }: IdeaDraftCommittedEvent): Idea {
    const { title, description } = data;
    state.title = title || (state.draft && state.draft.title) || state.title;
    state.description = description || (state.draft && state.draft.description) || state.description;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
