import {composeCommitFunctions} from '@centsideas/event-sourcing';
import {IIdeaState} from '@centsideas/models';

import {IdeaCreatedEvent} from './idea-created.event';
import {IdeaDeletedEvent} from './idea-deleted.event';
import {IdeaUpdatedEvent} from './idea-updated.event';

export const IdeasEvents = {
  IdeaCreatedEvent,
  IdeaDeletedEvent,
  IdeaUpdatedEvent,
};

export const commitFunctions = composeCommitFunctions<IIdeaState>(IdeasEvents);
