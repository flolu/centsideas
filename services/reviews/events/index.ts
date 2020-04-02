import { composeCommitFunctions } from '@cents-ideas/event-sourcing';
import { IReviewState } from '@cents-ideas/models';

import { ReviewCreatedEvent } from './review-created.event';
import { ReviewDraftSavedEvent } from './review-draft-saved.event';
import { ReviewUnpublishedEvent } from './review-unpublished.event';
import { ReviewUpdatedEvent } from './review-updated.event';
import { ReviewPublishedEvent } from './review-published.event';

export const ReviewEvents = {
  ReviewCreatedEvent,
  ReviewDraftSavedEvent,
  ReviewUnpublishedEvent,
  ReviewUpdatedEvent,
  ReviewPublishedEvent,
};

export const commitFunctions = composeCommitFunctions<IReviewState>(ReviewEvents);
