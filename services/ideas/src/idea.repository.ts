import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger } from '@cents-ideas/utils';
import { EventTopics } from '@cents-ideas/enums';

import { Idea } from './idea.entity';
import env from './environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor(private _messageBroker: MessageBroker, private _logger: Logger) {
    super(_messageBroker, _logger);
    this.initialize(Idea, env.database.url, env.database.name, EventTopics.Ideas);
  }
}
