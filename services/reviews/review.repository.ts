import { injectable, inject } from 'inversify';

import { EventRepository } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Review } from './review.entity';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewRepository extends EventRepository<Review> {
  constructor(@inject(ReviewsEnvironment) env: ReviewsEnvironment) {
    super(Review, env.reviewsDatabaseUrl, env.reviewsDatabaseName, EventTopics.Reviews);
  }
}
