import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger } from '@cents-ideas/utils';

import { Review } from './review.entity';
import env from './environment';

@injectable()
export class ReviewRepository extends EventRepository<Review> {
  constructor(private _messageBroker: MessageBroker, private _logger: Logger) {
    super(_messageBroker, _logger);
    this.initialize(Review, env.database.url, env.database.name);
  }
}
