import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { IIdeaState } from '@cents-ideas/models';

import { IdeaCreatedEvent, IdeaUpdatedEvent, IdeaDeletedEvent, commitFunctions } from './events';

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
    super(commitFunctions, (snapshot && snapshot.state) || Idea.initialState);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }

  static create(ideaId: string, userId: string, title: string, description: string): Idea {
    const idea = new Idea();
    idea.pushEvents(new IdeaCreatedEvent(ideaId, userId, title, description));
    return idea;
  }

  update(title?: string, description?: string): Idea {
    this.pushEvents(new IdeaUpdatedEvent(this.persistedState.id, title, description));
    return this;
  }

  delete(): Idea {
    this.pushEvents(new IdeaDeletedEvent(this.persistedState.id));
    return this;
  }
}