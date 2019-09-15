import { IEventEntity } from './event-entity';
import { IEvent } from '.';
import { Identifier } from '@cents-ideas/utils';
import { ISnapshot } from './snapshot';
// TODO add to package.sjon
import { injectable, unmanaged } from 'inversify';

export interface IEntityConstructor<Entity> {
  new (snapshot?: any): Entity;
}

@injectable()
export abstract class EventRepository<Entity extends IEventEntity> {
  private events: { [key: string]: IEvent[] } = {};
  private snapshots: { [key: string]: ISnapshot[] } = {};
  private readonly maxSnapshotsToKeep = 3;
  private readonly minNumberOfEventsToCreateSnapshot = 5;

  constructor(@unmanaged() protected readonly _Entity: IEntityConstructor<Entity>) {}

  save = async (entity: Entity) => {
    const streamId: string = entity.currentState.id;
    const lastPersistedEvent = await this.getLastEventOfStream(streamId);
    let eventNumber = (lastPersistedEvent && lastPersistedEvent.eventNumber) || 0;

    if (lastPersistedEvent && entity.lastPersistedEventId !== lastPersistedEvent.id) {
      // FIXME retry once?!
      throw new Error('concurrency issue!');
    }

    let eventsToInsert: IEvent[] = entity.pendingEvents.map(event => {
      eventNumber = eventNumber + 1;
      return { ...event, eventNumber };
    });

    await Promise.all(eventsToInsert.map(event => this.appendEvent(streamId, event)));
    return entity.confirmEvents();
  };

  findById = async (id: string): Promise<Entity> => {
    const snapshot = await this.getLastSnapshotOfStream(id);
    const events: IEvent[] = await (snapshot ? this.getEventsAfterSnapshot(snapshot) : this.getAllEventsFromStream(id));
    const entity = new this._Entity(snapshot);
    entity.pushEvents(...events);
    if (!entity.currentState.id) {
      throw entity.NotFoundError(id);
    }
    return entity.confirmEvents();
  };

  generateUniqueId = (): Promise<string> => {
    const checkAvailability = async (resolve: Function) => {
      const id = Identifier.makeUniqueId();
      const exists = !!(await this.getAllEventsFromStream(id)).length;
      exists ? checkAvailability(resolve) : resolve(id);
    };
    return new Promise(resolve => checkAvailability(resolve));
  };

  private getLastEventOfStream = async (streamId: string): Promise<IEvent | null> => {
    const stream = await this.getAllEventsFromStream(streamId);
    return stream && stream.length ? stream[stream.length - 1] : null;
  };

  private appendEvent = async (streamId: string, event: IEvent): Promise<boolean> => {
    if (!this.events[streamId]) {
      this.events[streamId] = [];
    }
    this.events[streamId].push(event);
    if (this.events[streamId].length % this.minNumberOfEventsToCreateSnapshot === 0) {
      await this.saveSnapshot(streamId);
    }
    return true;
  };

  getLastSnapshotOfStream = async (streamId: string): Promise<ISnapshot | null> => {
    return this.snapshots[streamId] && this.snapshots[streamId].length
      ? this.snapshots[streamId][this.snapshots[streamId].length - 1]
      : null;
  };

  getAllEventsFromStream = async (streamId: string): Promise<IEvent[]> => {
    return this.events[streamId] || [];
  };

  private getEventsAfterSnapshot = async (snapshot: any): Promise<IEvent[]> => {
    const streamId = snapshot.state.id;
    const lastEventId = snapshot.lastEventId;
    return this.events[streamId].slice(this.events[streamId].map(e => e.id).indexOf(lastEventId));
  };

  private saveSnapshot = async (streamId: string): Promise<boolean> => {
    const entity = await this.findById(streamId);
    const lastEvent = await this.getLastEventOfStream(streamId);
    if (!lastEvent) {
      return false;
    }
    if (!this.snapshots[streamId]) {
      this.snapshots[streamId] = [];
    }
    this.snapshots[streamId].push({ lastEventId: lastEvent.id, state: entity.persistedState });
    if (this.snapshots[streamId].length > this.maxSnapshotsToKeep) {
      this.snapshots[streamId].shift();
    }
    return true;
  };
}
