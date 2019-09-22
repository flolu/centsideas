import { Event } from '@cents-ideas/event-sourcing';

import { IIdeaState } from '../idea.entity';

export class IdeaDraftCommittedEvent extends Event<{}> {
  static readonly eventName: string = 'idea-draft-committed';

  constructor(ideaId: string) {
    super(IdeaDraftCommittedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState): IIdeaState {
    state.title = state.draft.title;
    state.description = state.draft.description;
    state.draft.title = null;
    state.draft.description = null;
    state.updatedAt = new Date().toISOString();
    return state;
  }
}
