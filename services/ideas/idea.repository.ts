import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Idea } from './idea.entity';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor(private messageBroker: MessageBroker, private env: IdeasEnvironment) {
    super(
      messageBroker.dispatchEvents,
      Idea,
      env.database.url,
      env.database.name,
      EventTopics.Ideas,
    );
  }
}
