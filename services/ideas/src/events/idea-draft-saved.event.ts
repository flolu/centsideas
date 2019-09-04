import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaDraftSavedEvent extends Event<{
  title?: string;
  description?: string;
}> {
  static readonly eventName = 'idea-draft-saved';

  constructor(title?: string, description?: string) {
    super(IdeaDraftSavedEvent.eventName, { title, description });
  }

  static commit(state: Idea, { data }: IdeaDraftSavedEvent): Idea {
    const { title, description } = data;
    state.title = title || state.title;
    state.description = description || state.description;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
