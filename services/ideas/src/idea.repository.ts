import { EventRepository, IEvent } from '@cents-ideas/event-sourcing';
import { Identifier } from '@cents-ideas/utils';
import { IdeaNotFoundError } from './errors/idea-not-found.error';
import { Idea } from './idea.entity';

// FIXME snapshots
export class IdeaRepository extends EventRepository<Idea> {
  private events: { [key: string]: IEvent<any>[] } = {};

  constructor() {
    super(Idea);
  }

  // TODO event numbers
  // TODO concurrency control
  save = async (idea: Idea): Promise<Idea> => {
    const currentEvents = await this.getStream(idea.id);
    this.events[idea.id] = [...currentEvents, ...idea.pendingEvents];
    return idea.confirmEvents();
  };

  findById = async (id: string) => {
    const idea = new Idea();
    const events = await this.getStream(id);
    if (!events.length) {
      throw new IdeaNotFoundError(id);
    }
    idea.pushNewEvents(events);
    return idea.confirmEvents();
  };

  getStream = async (streamId: string): Promise<IEvent<any>[]> => {
    return this.events[streamId] || [];
  };

  generateUniqueId = (): Promise<string> => {
    const checkAvailability = async (resolve: Function) => {
      const id = Identifier.makeUniqueId();
      const exists = !!(await this.getStream(id)).length;
      exists ? checkAvailability(resolve) : resolve(id);
    };
    return new Promise(resolve => checkAvailability(resolve));
  };
}
