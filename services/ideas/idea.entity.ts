import { EventEntity, ISnapshot } from '@centsideas/event-sourcing';
import { IIdeaState } from '@centsideas/models';

import { commitFunctions, IdeasEvents } from './events';

// FIXME consider creating "locked values" (e.g. userId should be locked after first set, because it must never change)
export class Idea extends EventEntity<IIdeaState> {
  static initialState: IIdeaState = {
    id: '',
    userId: '',
    title: '',
    description: '',
    createdAt: null,
    updatedAt: null,
    deleted: false,
    deletedAt: null,
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<IIdeaState>) {
    if (snapshot && snapshot.state) {
      super(commitFunctions, snapshot.state);
      this.lastPersistedEventId = snapshot.lastEventId;
    } else super(commitFunctions, Idea.initialState);
  }

  static create(ideaId: string, userId: string, title: string, description: string): Idea {
    const idea = new Idea();
    idea.pushEvents(new IdeasEvents.IdeaCreatedEvent(ideaId, userId, title, description));
    return idea;
  }

  update(title?: string, description?: string): Idea {
    this.pushEvents(new IdeasEvents.IdeaUpdatedEvent(this.currentState.id, title, description));
    return this;
  }

  delete(): Idea {
    this.pushEvents(new IdeasEvents.IdeaDeletedEvent(this.currentState.id));
    return this;
  }
}
