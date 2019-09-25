import { Event } from '@cents-ideas/event-sourcing';

import { IIdeaState } from '../idea.entity';

export class IdeaDraftDiscardedEvent extends Event<{}> {
  static readonly eventName = 'idea-draft-discarded';

  constructor(ideaId: string) {
    super(IdeaDraftDiscardedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState): IIdeaState {
    state.draft = null;
    return state;
  }
}
