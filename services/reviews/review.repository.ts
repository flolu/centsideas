import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { EventTopics } from '@cents-ideas/enums';

import { Review } from './review.entity';
import env from './environment';

@injectable()
export class ReviewRepository extends EventRepository<Review> {
  constructor(private _messageBroker: MessageBroker) {
    super(_messageBroker);
    this.initialize(Review, env.database.url, env.database.name, EventTopics.Reviews);
  }
}
