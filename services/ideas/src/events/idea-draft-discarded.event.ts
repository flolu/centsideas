import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaDraftDiscardedEvent } from '@cents-ideas/models';

import { IIdeaState } from '../idea.entity';

export class IdeaDraftDiscardedEvent extends Event<IIdeaDraftDiscardedEvent> {
  static readonly eventName = IdeaEvents.IdeaDraftDiscarded;

  constructor(ideaId: string) {
    super(IdeaDraftDiscardedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState): IIdeaState {
    state.draft = null;
    return state;
  }
}
