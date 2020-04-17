import { Event } from '@centsideas/event-sourcing';
import { IdeaEvents } from '@centsideas/enums';
import { IIdeaCreatedEvent, IIdeaState } from '@centsideas/models';

export class IdeaCreatedEvent extends Event<IIdeaCreatedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaCreated;

  constructor(ideaId: string, userId: string, title: string, description: string) {
    super(IdeaCreatedEvent.eventName, { ideaId, userId, title, description }, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaCreatedEvent): IIdeaState {
    state.id = event.aggregateId;
    state.userId = event.data.userId;
    state.createdAt = event.timestamp;
    state.title = event.data.title;
    state.description = event.data.description;
    return state;
  }
}
