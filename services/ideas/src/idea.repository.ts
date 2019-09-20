import { injectable } from 'inversify';

import { EventRepository } from '@cents-ideas/event-sourcing';

import { Idea } from './idea.entity';
import env from './environment';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor() {
    super();
    this.initialize(Idea, env.database.url, env.database.name);
  }
}
