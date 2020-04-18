import { injectable } from 'inversify';

import { Identifier, EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';

import { IEventRepository, IEntityConstructor } from '../event-repository';
import { IEventEntity, IEvent, ISnapshot } from '..';

@injectable()
export class EventRepositoryMock<Entity extends IEventEntity> implements IEventRepository<Entity> {
  private events: { [id: string]: IEvent[] } = {};
  private snapshots: { [id: string]: ISnapshot } = {};
  private snapshotThreshold: number = 100;
  protected _Entity: IEntityConstructor<Entity> | undefined;

  initialize = (
    entity: IEntityConstructor<Entity>,
    url: string,
    name: string,
    topicName: string,
    initFunctions: any[] = [],
    minNumberOfEventsToCreateSnapshot: number = 100,
  ) => {
    this._Entity = entity;
    this.snapshotThreshold = minNumberOfEventsToCreateSnapshot;
  };

  save = (entity: Entity) => {
    const streamId: string = entity.persistedState.id || entity.currentState.id;
    const lastPersistedEvent = this.getLastEventOfStream(streamId);
    let eventNumber = (lastPersistedEvent && lastPersistedEvent.eventNumber) || 0;
    if (lastPersistedEvent && entity.lastPersistedEventId !== lastPersistedEvent.id) {
      throw new Error('concurrency issue!');
    }

    const eventsToInsert: IEvent[] = entity.pendingEvents.map(event => {
      eventNumber = eventNumber + 1;
      return { ...event, eventNumber };
    });

    const appendedEvents = eventsToInsert.map(event => this.appendEvent(event));

    for (const event of appendedEvents) {
      if (event.eventNumber % this.snapshotThreshold === 0) {
        this.saveSnapshot(event.aggregateId);
      }
    }
    return entity.confirmEvents();
  };

  findById = (id: string) => {
    const snapshot = this.getSnapshot(id);

    const events: IEvent[] = snapshot
      ? this.getEventsAfterSnapshot(snapshot)
      : this.getEventStream(id);

    if (!this._Entity)
      throw new Error('You need to initialize EventEntity (eventRepository.initialize())');
    const entity = new this._Entity(snapshot || undefined);
    entity.pushEvents(...events);
    if (!entity.currentState.id) {
      throw new EntityError(
        `Event repository couldn't find entity with id: ${id}`,
        HttpStatusCodes.NotFound,
      );
    }

    return entity.confirmEvents();
  };

  listAll = async (): Promise<Entity[]> => {
    const ids = Object.keys(this.events);
    return ids.map(id => this.findById(id));
  };

  generateUniqueId = (): Promise<string> => {
    const checkAvailability = (resolve: (id: string) => any) => {
      const id = Identifier.makeUniqueId();
      const result = Object.keys(this.events).includes(id);
      result ? checkAvailability(resolve) : resolve(id);
    };
    return new Promise(resolve => checkAvailability(resolve));
  };

  private getLastEventOfStream = (streamId: string): IEvent | null =>
    this.events[streamId] && this.events[streamId][this.events[streamId].length - 1];

  private appendEvent = (event: IEvent): IEvent => {
    if (!this.events[event.aggregateId]) {
      this.events[event.aggregateId] = [];
    }
    this.events[event.aggregateId].push({ ...event });
    return event;
  };

  private saveSnapshot = (streamId: string): boolean => {
    const entity = this.findById(streamId);
    const lastEvent = this.getLastEventOfStream(streamId);
    if (!lastEvent) {
      return false;
    }
    this.snapshots[streamId] = {
      lastEventId: lastEvent.id,
      state: entity.persistedState,
    };
    return true;
  };

  private getSnapshot = (streamId: string): ISnapshot | null => this.snapshots[streamId];

  private getEventStream = (streamId: string, from: number = 1, to: number = 2 ** 31 - 1) => {
    const fromIndex = this.events[streamId].map(e => e.eventNumber).indexOf(from);
    let toIndex = this.events[streamId].map(e => e.eventNumber).indexOf(to);
    toIndex = toIndex === -1 ? this.events[streamId].length : toIndex;
    return this.events[streamId].slice(fromIndex, toIndex);
  };

  private getEventsAfterSnapshot = (snapshot: ISnapshot): IEvent[] => {
    const streamId = snapshot.state.id;
    const lastEventId = snapshot.lastEventId;

    const lastEvent: IEvent | undefined = this.events[streamId].find(e => e.id === lastEventId);
    if (!lastEvent) {
      throw new Error(
        `Couldn't find events after snapshot with last event id: ${snapshot.lastEventId}`,
      );
    }
    const lastEventNumber = lastEvent.eventNumber;

    return this.getEventStream(streamId, lastEventNumber);
  };
}
