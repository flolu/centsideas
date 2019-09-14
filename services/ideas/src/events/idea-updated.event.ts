import { Event } from '@cents-ideas/event-sourcing';
import { Idea, IIdeaState } from '../idea.entity';

export class IdeaUpdatedEvent extends Event<{
  title?: string;
  description?: string;
}> {
  static readonly eventName: string = 'idea-updated';

  constructor(ideaId: string, title?: string, description?: string) {
    super(IdeaUpdatedEvent.eventName, { title, description }, ideaId);
  }

  static commit(state: IIdeaState, { data }: IdeaUpdatedEvent): IIdeaState {
    const { title, description } = data;
    state.title = title || state.title;
    state.description = description || state.description;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
