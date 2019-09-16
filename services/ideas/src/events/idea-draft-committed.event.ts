import { Event } from '@cents-ideas/event-sourcing';
import { Idea, IIdeaState } from '../idea.entity';

export class IdeaDraftCommittedEvent extends Event<{
  title?: string;
  description?: string;
}> {
  static readonly eventName: string = 'idea-draft-committed';

  constructor(ideaId: string, title?: string, description?: string) {
    super(IdeaDraftCommittedEvent.eventName, { title, description }, ideaId);
  }

  static commit(state: IIdeaState, { data }: IdeaDraftCommittedEvent): IIdeaState {
    const { title, description } = data;
    state.title = title || (state.draft && state.draft.title) || state.title;
    state.description = description || (state.draft && state.draft.description) || state.description;
    state.draft.title = null;
    state.draft.description = null;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
