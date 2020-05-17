import {Event} from '@centsideas/event-sourcing';
import {IdeaEvents} from '@centsideas/enums';
import {IIdeaCreatedEvent, IIdeaState} from '@centsideas/models';

// FIXME more "guided" way of creating events (currently i could easily forget to add eventName or commit function)
export class IdeaCreatedEvent extends Event<IIdeaCreatedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaCreated;

  constructor(payload: IIdeaCreatedEvent) {
    super(IdeaCreatedEvent.eventName, payload, payload.ideaId);
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
