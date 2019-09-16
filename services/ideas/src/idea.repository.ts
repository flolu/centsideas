import { injectable } from 'inversify';

import { EventRepository } from '@cents-ideas/event-sourcing';

import { Idea } from './idea.entity';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor() {
    super(Idea);

    this.initialize('mongodb://ideas-event-store:27017', 'ideas');
  }
}
