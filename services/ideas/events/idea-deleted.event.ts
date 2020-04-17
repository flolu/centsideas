import { Event } from '@centsideas/event-sourcing';
import { IdeaEvents } from '@centsideas/enums';
import { IIdeaDeletedEvent, IIdeaState } from '@centsideas/models';

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
