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

  // TODO concurrency control
  save = async (idea: Idea): Promise<Idea> => {
    const streamId = idea.id;
    const lastEvent = await this.getLastEvent(streamId);
    let eventNumber = 0;
    if (lastEvent) {
      eventNumber = lastEvent.eventNumber;
    }
    let eventsToInsert = idea.pendingEvents.map(e => {
      eventNumber = eventNumber + 1;
      return {
        ...e,
        eventNumber,
      };
    });
    for (const event of eventsToInsert) {
      if (event.eventNumber === 1) {
        this.events[streamId] = [event];
      } else {
        this.events[streamId].push(event);
      }
    }
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

  private getLastEvent = async (streamId: string): Promise<IEvent<any>> => {
    const stream = await this.getStream(streamId);
    if (stream) {
      return stream[stream.length - 1];
    } else {
      return null;
    }
  };
}
