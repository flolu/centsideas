import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaDraftDiscardedEvent, IIdeaState } from '@cents-ideas/models';

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
