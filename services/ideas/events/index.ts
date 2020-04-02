import { composeCommitFunctions } from '@cents-ideas/event-sourcing';
import { IIdeaState } from '@cents-ideas/models';

import { IdeaCreatedEvent } from './idea-created.event';
import { IdeaDeletedEvent } from './idea-deleted.event';
import { IdeaUpdatedEvent } from './idea-updated.event';

export const IdeasEvents = {
  IdeaCreatedEvent,
  IdeaDeletedEvent,
  IdeaUpdatedEvent,
};

export const commitFunctions = composeCommitFunctions<IIdeaState>(IdeasEvents);
