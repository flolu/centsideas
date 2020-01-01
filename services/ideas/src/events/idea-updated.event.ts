import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaUpdatedEvent, IIdeaState } from '@cents-ideas/models';

export class IdeaUpdatedEvent extends Event<IIdeaUpdatedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaUpdated;

  constructor(ideaId: string, title?: string, description?: string) {
    super(IdeaUpdatedEvent.eventName, { title, description }, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaUpdatedEvent): IIdeaState {
    const { title, description } = event.data;
    state.title = title || state.title;
    state.description = description || state.description;
    state.updatedAt = event.timestamp;
    return state;
  }
}
