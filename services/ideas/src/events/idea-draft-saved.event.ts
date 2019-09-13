import { Event } from '@cents-ideas/event-sourcing';
import { Idea } from '../idea.entity';

export class IdeaDraftSavedEvent extends Event<{
  title?: string;
  description?: string;
}> {
  static readonly eventName = 'idea-draft-saved';

  constructor(ideaId: string, title?: string, description?: string) {
    super(IdeaDraftSavedEvent.eventName, { title, description }, ideaId);
  }

  static commit(state: Idea, { data }: IdeaDraftSavedEvent): Idea {
    const { title, description } = data;
    state.draft = {
      ...state.draft,
      title: title || (state.draft && state.draft.title) || '',
      description: description || (state.draft && state.draft.description) || '',
    };
    return state;
  }
}
