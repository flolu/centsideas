import { injectable, unmanaged } from 'inversify';
import { MongoClient } from 'mongodb';
import * as asyncRetry from 'async-retry';

import { IEvent } from '@centsideas/models';
import { Logger, Identifier } from '@centsideas/utils';
import { IEventEntity } from './event-entity';
import { ISnapshot } from './snapshot';

interface ICounter {
  name: string;
  count: number;
}

interface IDatabaseEvent extends IEvent {
  position: number;
}

// FIXME create indexes to increase read performance

@injectable()
export abstract class EventRepository<Entity extends IEventEntity> {
  private client = new MongoClient(this.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  private readonly eventCounterName = 'events';
  private readonly eventsCollectionSuffix = 'events';
  private readonly snapshotsCollectionSuffix = 'snapshots';
  private readonly counterCollectionSuffix = 'counters';

  constructor(
    private dispatchEvents: (topic: string, events: IEvent[]) => void,
    private entity: new (snapshot?: ISnapshot) => Entity,
    private databaseUrl: string,
    private databaseName: string,
    private topicName: string,
    private snapshotThreshold = 100,
  ) {
    this.initialize();
  }

  save = async (entity: Entity): Promise<Entity> => {
    const lastPersistedEvent = await this.getLastEvent(entity.currentState.id);

    // optimistic concurrency control https://youtu.be/GzrZworHpIk?t=1028
    if (lastPersistedEvent) {
      const streamNumber = lastPersistedEvent.eventNumber;
      const entityNumber = entity.persistedState.lastEventNumber;
      if (streamNumber !== entityNumber)
        throw new Error(
          `optimistic concurrency control issue (${streamNumber} !== ${entityNumber})`,
        );
    }

    let eventNumber = lastPersistedEvent?.eventNumber || 0;
    const eventsToInsert: IEvent[] = entity.pendingEvents.map(event => {
      eventNumber += 1;
      return { ...event, eventNumber };
    });

    const appendedEvents = await Promise.all(eventsToInsert.map(this.appendEvent));
    const events = await Promise.all(
      appendedEvents.map(async event => {
        Logger.event(event);
        if (event.eventNumber % this.snapshotThreshold === 0)
          await this.saveSnapshot(event.aggregateId);
        return event;
      }),
    );

    this.dispatchEvents(this.topicName, events);
    return entity.confirmEvents();
  };

  findById = async (aggregateId: string): Promise<Entity> => {
    const collection = await this.snapshotsCollection();
    const snapshot = await collection.findOne({ aggregateId });

    const events = await (snapshot
      ? this.getEventsAfterSnapshot(snapshot)
      : this.getEvents(aggregateId));

    const entity = new this.entity(snapshot || undefined);
    entity.pushEvents(...events);
    if (!entity.currentState.id) throw new Error(`Entity with id ${aggregateId} not found`);

    return entity.confirmEvents();
  };

  generateAggregateId = async (long = true, maxRetries = 5) => {
    const collection = await this.eventsCollection();
    let count = 0;

    const check = async (resolve: (id: string) => void) => {
      count++;
      if (count > maxRetries)
        throw new Error(`Unique aggregate id could not be generated after ${count} retries`);

      const id = long ? Identifier.makeLongId() : Identifier.makeShortId();
      const result = await collection.findOne({ aggregateId: id });
      result ? await check(resolve) : resolve(id);
    };

    return new Promise(check);
  };

  private getEventsAfterSnapshot = async (snapshot: ISnapshot) => {
    const collection = await this.eventsCollection();
    const lastEvent = await collection.findOne({ id: snapshot.lastEventId });
    if (!lastEvent) throw new Error(`Last event with id ${snapshot.lastEventId} not found`);
    return this.getEvents(snapshot.state.id, lastEvent.eventNumber);
  };

  private getEvents = async (aggregateId: string, from = 0) => {
    const collection = await this.eventsCollection();
    const result = await collection.find(
      { $and: [{ aggregateId }, { eventNumber: { $gte: from } }] },
      { sort: { eventNumber: 1 } },
    );
    return result.toArray();
  };

  private getLastEvent = async (aggregateId: string): Promise<IDatabaseEvent | null> => {
    const collection = await this.eventsCollection();

    const result = await collection.find(
      { aggregateId },
      {
        sort: { eventNumber: -1 },
        limit: 1,
      },
    );
    return (await result.toArray())[0];
  };

  private appendEvent = async (event: IEvent): Promise<IEvent> => {
    const counterCollection = await this.counterCollection();
    const counter = await counterCollection.findOneAndUpdate(
      { name: this.eventCounterName },
      { $inc: { count: 1 } },
      { returnOriginal: false },
    );
    if (!counter.value) throw new Error('Events counter not found');
    const position = counter.value.count;

    const collection = await this.eventsCollection();
    const result = await collection.insertOne({ ...event, position });
    return result.ops[0];
  };

  private saveSnapshot = async (aggregateId: string) => {
    const entity = await this.findById(aggregateId);
    if (!entity) throw new Error(`Entity with id ${aggregateId} not found`);

    const lastEvent = await this.getLastEvent(aggregateId);
    if (!lastEvent) throw new Error(`Last event for ${aggregateId} not found`);

    const collection = await this.snapshotsCollection();
    return collection.updateOne(
      { aggregateId },
      { $set: { aggregateId, lastEventId: lastEvent.id, state: entity.persistedState } },
      { upsert: true },
    );
  };

  private initialize = async () => {
    const counters = await this.counterCollection();
    const existing = await counters.findOne({ name: this.eventCounterName });
    if (!existing) await counters.insertOne({ name: this.eventCounterName, count: 0 });
  };

  private snapshotsCollection = async () => {
    const db = await this.database();
    return db.collection<ISnapshot>(`${this.databaseName}_${this.snapshotsCollectionSuffix}`);
  };

  private counterCollection = async () => {
    const db = await this.database();
    return db.collection<ICounter>(`${this.databaseName}_${this.counterCollectionSuffix}`);
  };

  private eventsCollection = async () => {
    const db = await this.database();
    return db.collection<IDatabaseEvent>(`${this.databaseName}_${this.eventsCollectionSuffix}`);
  };

  private database = async () => {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.databaseName);
  };
}
