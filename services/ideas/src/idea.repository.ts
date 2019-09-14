import { EventRepository, IEvent } from '@cents-ideas/event-sourcing';
import { Identifier } from '@cents-ideas/utils';
import { IdeaNotFoundError } from './errors/idea-not-found.error';
import { Idea, IIdeaState } from './idea.entity';

export interface ISnapshot<EntityState> {
  lastEventId: string;
  state: EntityState;
}
// TODO move generic logic to event repo
export class IdeaRepository extends EventRepository {
  private events: { [key: string]: IEvent[] } = {};
  private snapshots: { [key: string]: ISnapshot<IIdeaState>[] } = {};
  private readonly maxSnapshotsToKeep = 3;
  private readonly minNumberOfEventsToCreateSnapshot = 5;

  constructor() {
    super();
  }

  save = async (idea: Idea): Promise<Idea> => {
    const streamId = idea.currentState.id;
    const lastPersistedEvent = await this.getLastEvent(streamId);
    let eventNumber = 0;
    if (lastPersistedEvent) {
      if (idea.lastPersistedEventId !== lastPersistedEvent.id) {
        // FIXME retry once?!
        throw new Error('concurrency issue!');
      }
      eventNumber = lastPersistedEvent.eventNumber;
    }
    let eventsToInsert: IEvent[] = idea.pendingEvents.map(e => {
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
      if (eventNumber % this.minNumberOfEventsToCreateSnapshot === 0) {
        this.saveSnapshot(streamId);
      }
    }
    // FIXME event publisher
    return idea.confirmEvents();
  };

  // TODO idea not found error
  findById = async (id: string) => {
    const snapshot = await this.getLatestSnapshot(id);
    let events: IEvent[] = [];
    let idea: Idea;
    if (snapshot) {
      idea = new Idea(snapshot);
      events = await this.getEventsAfterSnapshot(snapshot);
    } else {
      idea = new Idea();
      events = await this.getStream(id);
    }
    idea.pushEvents(...events);
    idea.confirmEvents();
    if (!idea.persistedState.id) {
      throw new IdeaNotFoundError(id);
    }
    idea.pushEvents(...events);
    return idea.confirmEvents();
  };

  getStream = async (streamId: string): Promise<IEvent[]> => {
    return this.events[streamId] || [];
  };

  getSnapshots = async (aggregateId: string): Promise<ISnapshot<IIdeaState>[]> => {
    return this.snapshots[aggregateId] || [];
  };

  generateUniqueId = (): Promise<string> => {
    /**
     * Generate ids until it is unique
     */
    const checkAvailability = async (resolve: Function) => {
      const id = Identifier.makeUniqueId();
      const exists = !!(await this.getStream(id)).length;
      exists ? checkAvailability(resolve) : resolve(id);
    };
    return new Promise(resolve => checkAvailability(resolve));
  };

  private getEventsAfterSnapshot = (snapshot: ISnapshot<IIdeaState>) => {
    const streamId = snapshot.state.id;
    const lastEventId = snapshot.lastEventId;
    return this.events[streamId].slice(this.events[streamId].map(e => e.id).indexOf(lastEventId));
  };

  private getLatestSnapshot = async (streamId: string): Promise<ISnapshot<IIdeaState>> => {
    if (this.snapshots[streamId] && this.snapshots[streamId].length) {
      return this.snapshots[streamId][this.snapshots[streamId].length - 1];
    } else {
      return null;
    }
  };

  private getLastEvent = async (streamId: string): Promise<IEvent> => {
    const stream = await this.getStream(streamId);
    if (stream) {
      return stream[stream.length - 1];
    } else {
      return null;
    }
  };

  private saveSnapshot = async (streamId: string) => {
    const idea = await this.findById(streamId);
    const lastEvent = await this.getLastEvent(streamId);
    if (!this.snapshots[streamId]) {
      this.snapshots[streamId] = [];
    }
    this.snapshots[streamId].push({ lastEventId: lastEvent.id, state: idea.persistedState });
    if (this.snapshots[streamId].length > this.maxSnapshotsToKeep) {
      this.snapshots[streamId].shift();
    }
  };
}
