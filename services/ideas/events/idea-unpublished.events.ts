import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaUnpublishedEvent, IIdeaState } from '@cents-ideas/models';

export class IdeaUnpublishedEvent extends Event<IIdeaUnpublishedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaUnpublished;

  constructor(ideaId: string) {
    super(IdeaUnpublishedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaUnpublishedEvent): IIdeaState {
    state.published = false;
    state.unpublishedAt = event.timestamp;
    return state;
  }
}
