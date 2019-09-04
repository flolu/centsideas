import { EventRepository } from '@cents-ideas/event-sourcing';
import { Idea } from './idea.entity';

// FIXME snapshots
// NEXT in memory for now
export class IdeaRepository extends EventRepository<Idea> {
  constructor() {
    super(Idea);
  }

  // TODO event numbers
  // TODO concurrency control

  save(idea: Idea): Promise<Idea> {
    // TODO implement save
    return new Promise(resolve => {
      return resolve(idea);
    });
  }

  findById(id: string): Promise<Idea> {
    // TODO implement findById
    return new Promise(resolve => {
      return resolve(new Idea());
    });
  }
}
