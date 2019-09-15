import { EventRepository } from '@cents-ideas/event-sourcing';
import { Idea } from './idea.entity';
import { injectable } from 'inversify';

@injectable()
export class IdeaRepository extends EventRepository<Idea> {
  constructor() {
    super(Idea);
  }
}
