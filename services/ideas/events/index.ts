import { IEventCommitFunctions } from '@cents-ideas/event-sourcing';
import { IIdeaState } from '@cents-ideas/models';

import { IdeaCreatedEvent } from './idea-created.event';
import { IdeaDeletedEvent } from './idea-deleted.event';
import { IdeaUpdatedEvent } from './idea-updated.event';

export const commitFunctions: IEventCommitFunctions<IIdeaState> = {
  [IdeaCreatedEvent.eventName]: IdeaCreatedEvent.commit,
  [IdeaDeletedEvent.eventName]: IdeaDeletedEvent.commit,
  [IdeaUpdatedEvent.eventName]: IdeaUpdatedEvent.commit,
};

export { IdeaCreatedEvent } from './idea-created.event';
export { IdeaDeletedEvent } from './idea-deleted.event';
export { IdeaUpdatedEvent } from './idea-updated.event';
