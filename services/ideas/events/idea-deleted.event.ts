import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaDeletedEvent, IIdeaState } from '@cents-ideas/models';

export class IdeaDeletedEvent extends Event<IIdeaDeletedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaDeleted;

  constructor(ideaId: string) {
    super(IdeaDeletedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaDeletedEvent): IIdeaState {
    state.deleted = true;
    state.deletedAt = event.timestamp;
    return state;
  }
}
