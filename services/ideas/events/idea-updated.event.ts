import {Event} from '@centsideas/event-sourcing';
import {IdeaEvents} from '@centsideas/enums';
import {IIdeaUpdatedEvent, IIdeaState} from '@centsideas/models';

export class IdeaUpdatedEvent extends Event<IIdeaUpdatedEvent> {
  static readonly eventName: string = IdeaEvents.IdeaUpdated;

  constructor(ideaId: string, payload: IIdeaUpdatedEvent) {
    super(IdeaUpdatedEvent.eventName, payload, ideaId);
  }

  static commit(state: IIdeaState, event: IdeaUpdatedEvent): IIdeaState {
    const {title, description} = event.data;
    state.title = title || state.title;
    state.description = description || state.description;
    state.updatedAt = event.timestamp;
    return state;
  }
}
