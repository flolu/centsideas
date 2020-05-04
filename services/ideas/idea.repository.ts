import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Idea } from './idea.entity';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor(private _messageBroker: MessageBroker, private _env: IdeasEnvironment) {
    super(
      _messageBroker.dispatchEvents,
      Idea,
      _env.ideasDatabaseUrl,
      _env.ideasDatabaseName,
      EventTopics.Ideas,
    );
  }
}
