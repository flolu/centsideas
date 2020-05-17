import {injectable, inject} from 'inversify';

import {EventRepository} from '@centsideas/event-sourcing';
import {EventTopics} from '@centsideas/enums';

import {Idea} from './idea.entity';
import {IdeasEnvironment} from './ideas.environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor(@inject(IdeasEnvironment) env: IdeasEnvironment) {
    super(Idea, env.ideasDatabaseUrl, env.ideasDatabaseName, EventTopics.Ideas);
  }
}
