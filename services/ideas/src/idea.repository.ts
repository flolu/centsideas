import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger } from '@cents-ideas/utils';

import { Idea } from './idea.entity';
import env from './environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  // FIXME find a way to inject those instead of passing it down (https://stackoverflow.com/questions/58016087)
  constructor(private _messageBroker: MessageBroker, private _logger: Logger) {
    super(_messageBroker, _logger);
    // FIXME call init with super constructor and inject via @inject instead of from constructor?!
    this.initialize(Idea, env.database.url, env.database.name);
  }
}
