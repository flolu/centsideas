import { IEventCommitFunctions } from '@cents-ideas/event-sourcing';
import { IReviewState } from '../review.entity';
import { ReviewCreatedEvent } from './review-created.event';

export const commitFunctions: IEventCommitFunctions<IReviewState> = {
  [ReviewCreatedEvent.eventName]: ReviewCreatedEvent.commit,
};

export { ReviewCreatedEvent } from './review-created.event';
