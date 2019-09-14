import { EventRepository } from '@cents-ideas/event-sourcing';
import { Idea } from './idea.entity';

export class IdeaRepository extends EventRepository<Idea> {
  constructor() {
    super(Idea);
  }
}
