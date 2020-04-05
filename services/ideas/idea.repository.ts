import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { EventTopics } from '@cents-ideas/enums';

import { Idea } from './idea.entity';
import env from './environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor(private _messageBroker: MessageBroker) {
    super(_messageBroker);
    this.initialize(Idea, env.database.url, env.database.name, EventTopics.Ideas);
  }
}
