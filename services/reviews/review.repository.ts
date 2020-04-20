import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Review } from './review.entity';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewRepository extends EventRepository<Review> {
  constructor(private _messageBroker: MessageBroker, private env: ReviewsEnvironment) {
    super(_messageBroker);
    this.initialize(Review, this.env.database.url, this.env.database.name, EventTopics.Reviews);
  }
}
