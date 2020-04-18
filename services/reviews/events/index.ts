import { composeCommitFunctions } from '@centsideas/event-sourcing';
import { IReviewState } from '@centsideas/models';

import { ReviewCreatedEvent } from './review-created.event';
import { ReviewDeletedEvent } from './review-deleted.event';
import { ReviewUpdatedEvent } from './review-updated.event';

export const ReviewEvents = {
  ReviewCreatedEvent,
  ReviewUpdatedEvent,
  ReviewDeletedEvent,
};

export const commitFunctions = composeCommitFunctions<IReviewState>(ReviewEvents);
