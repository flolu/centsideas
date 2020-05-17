import {EventEntity, ISnapshot, initialEntityBaseState} from '@centsideas/event-sourcing';
import {IIdeaState, IIdeaCreatedEvent, IIdeaUpdatedEvent} from '@centsideas/models';

import {commitFunctions, IdeasEvents} from './events';

// FIXME consider creating "locked values" (e.g. userId should be locked after first set, because it must never change)
export class Idea extends EventEntity<IIdeaState> {
  static initialState: IIdeaState = {
    ...initialEntityBaseState,
    userId: '',
    title: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    deleted: false,
    deletedAt: '',
  };

  constructor(snapshot?: ISnapshot<IIdeaState>) {
    if (snapshot && snapshot.state) {
      super(commitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(commitFunctions, Idea.initialState);
  }

  static create(payload: IIdeaCreatedEvent): Idea {
    const idea = new Idea();
    idea.pushEvents(new IdeasEvents.IdeaCreatedEvent(payload));
    return idea;
  }

  update(payload: IIdeaUpdatedEvent): Idea {
    this.pushEvents(new IdeasEvents.IdeaUpdatedEvent(this.currentState.id, payload));
    return this;
  }

  delete(): Idea {
    this.pushEvents(new IdeasEvents.IdeaDeletedEvent(this.currentState.id));
    return this;
  }
}
