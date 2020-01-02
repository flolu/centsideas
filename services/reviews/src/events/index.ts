import { IEventCommitFunctions } from '@cents-ideas/event-sourcing';
import { IReviewState } from '@cents-ideas/models';

import { ReviewCreatedEvent } from './review-created.event';
import { ReviewDraftSavedEvent } from './review-draft-saved.event';
import { ReviewUnpublishedEvent } from './review-unpublished.event';
import { ReviewUpdatedEvent } from './review-updated.event';
import { ReviewPublishedEvent } from './review-published.event';

export const commitFunctions: IEventCommitFunctions<IReviewState> = {
  [ReviewCreatedEvent.eventName]: ReviewCreatedEvent.commit,
  [ReviewDraftSavedEvent.eventName]: ReviewDraftSavedEvent.commit,
  [ReviewUnpublishedEvent.eventName]: ReviewUnpublishedEvent.commit,
  [ReviewUpdatedEvent.eventName]: ReviewUpdatedEvent.commit,
  [ReviewPublishedEvent.eventName]: ReviewPublishedEvent.commit,
};

export { ReviewCreatedEvent } from './review-created.event';
export { ReviewDraftSavedEvent } from './review-draft-saved.event';
export { ReviewUnpublishedEvent } from './review-unpublished.event';
export { ReviewUpdatedEvent } from './review-updated.event';
export { ReviewPublishedEvent } from './review-published.event';
