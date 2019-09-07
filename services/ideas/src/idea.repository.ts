import { EventRepository, IEvent } from '@cents-ideas/event-sourcing';
import { Idea } from './idea.entity';

// FIXME snapshots
// NEXT in memory for now
export class IdeaRepository extends EventRepository<Idea> {
  events: { [key: string]: IEvent<any>[] } = {};

  constructor() {
    super(Idea);
  }

  // TODO event numbers
  // TODO concurrency control
  save(idea: Idea): Promise<Idea> {
    return new Promise(resolve => {
      // TODO implement save
      const currentEvents = this.events[idea.id];
      if (!(currentEvents && currentEvents.length)) {
        this.events[idea.id] = [];
      }
      this.events[idea.id] = [...currentEvents, ...idea.pendingEvents];
      return resolve(idea);
    });
  }

  // TODO implement findById
  findById(id: string): Promise<Idea> {
    return new Promise(resolve => {
      const idea = new Idea();
      idea.pushNewEvents(this.events[id]);
      idea.confirmEvents();
      return resolve(idea);
    });
  }
}
