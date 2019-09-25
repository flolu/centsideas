import { Event } from '@cents-ideas/event-sourcing';

import { IIdeaState } from '../idea.entity';

export class IdeaPublishedEvent extends Event<{}> {
  static readonly eventName: string = 'idea-published';

  constructor(ideaId: string) {
    super(IdeaPublishedEvent.eventName, {}, ideaId);
  }

  static commit(state: IIdeaState, _event: IdeaPublishedEvent): IIdeaState {
    state.published = true;
    state.publishedAt = new Date().toISOString();
    return state;
  }
}
