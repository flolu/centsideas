import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaDraftCommittedEvent, IIdeaState } from '@cents-ideas/models';

export class IdeaDraftCommittedEvent extends Event<IIdeaDraftCommittedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaDraftCommitted;

  constructor(ideaId: string) {
    super(IdeaDraftCommittedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState): IIdeaState {
    state.title = (state.draft && state.draft.title) || '';
    state.description = (state.draft && state.draft.description) || '';
    state.draft = null;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
