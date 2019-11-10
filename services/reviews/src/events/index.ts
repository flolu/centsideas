import { IEventCommitFunctions } from '@cents-ideas/event-sourcing';
import { IReviewState } from '../review.entity';
import { ReviewCreatedEvent } from './review-created.event';
import { ReviewDraftSavedEvent } from './review-draft-saved.event';

export const commitFunctions: IEventCommitFunctions<IReviewState> = {
  [ReviewCreatedEvent.eventName]: ReviewCreatedEvent.commit,
  [ReviewDraftSavedEvent.eventName]: ReviewDraftSavedEvent.commit,
};

export { ReviewCreatedEvent } from './review-created.event';
export { ReviewDraftSavedEvent } from './review-draft-saved.event';
