import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaPublishedEvent, IIdeaState } from '@cents-ideas/models';

export class IdeaPublishedEvent extends Event<IIdeaPublishedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaPublished;

  constructor(ideaId: string) {
    super(IdeaPublishedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState, _event: IdeaPublishedEvent): IIdeaState {
    state.published = true;
    state.publishedAt = new Date().toISOString();
    return state;
  }
}
