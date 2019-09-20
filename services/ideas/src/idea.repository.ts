import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';

import { Idea } from './idea.entity';
import env from './environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  // FIXME find a way to inject Broker into EventRepository instead of passing it down
  constructor(private mb: MessageBroker) {
    super(mb);
    this.initialize(Idea, env.database.url, env.database.name);
  }
}
