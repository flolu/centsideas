import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Review } from './review.entity';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewRepository extends EventRepository<Review> {
  constructor(private _env: ReviewsEnvironment, private _messageBroker: MessageBroker) {
    super(
      _messageBroker.dispatchEvents,
      Review,
      _env.reviewsDatabaseUrl,
      _env.reviewsDatabaseName,
      EventTopics.Reviews,
    );
  }
}
