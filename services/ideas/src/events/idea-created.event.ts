import { Event } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import { IIdeaCreatedEvent } from '@cents-ideas/models';

import { IIdeaState } from '../idea.entity';

export class IdeaCreatedEvent extends Event<IIdeaCreatedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaCreated;

  constructor(ideaId: string) {
    super(IdeaCreatedEvent.eventName, { ideaId }, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaCreatedEvent): IIdeaState {
    state.id = event.aggregateId;
    state.createdAt = new Date().toISOString();
    state.deleted = false;
    state.published = false;
    return state;
  }
}
