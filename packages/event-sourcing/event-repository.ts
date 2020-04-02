import * as retry from 'async-retry';
import { injectable } from 'inversify';
import { MongoClient, Db, Collection } from 'mongodb';

import { Identifier, renameObjectProperty, Logger, EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

import { IEventEntity } from './event-entity';
import { ISnapshot } from './snapshot';
import { IEvent, MessageBroker } from '.';

export type IEntityConstructor<Entity> = new (snapshot?: ISnapshot) => Entity;

export interface IEventRepository<Entity> {
  initialize: (
    entity: IEntityConstructor<Entity>,
    url: string,
    name: string,
    topicName: string,
    initFunctions: any[],
    minNumberOfEventsToCreateSnapshot: number,
  ) => void;
  save: (entity: Entity) => Promise<Entity>;
  findById: (id: string) => Promise<Entity>;
  generateUniqueId: () => Promise<string>;
}

@injectable()
export abstract class EventRepository<Entity extends IEventEntity>
  implements IEventRepository<Entity> {
  protected _Entity!: IEntityConstructor<Entity>;

  private client!: MongoClient;
  private db!: Db;
  private eventCollection!: Collection;
  private snapshotCollection!: Collection;
  private counterCollection!: Collection;
  private namespace!: string;
  private topicName!: string;
  private snapshotThreshold!: number;
  private hasInitializedBeenCalled: boolean = false;
  private hasInitialized: boolean = false;

  constructor(private messageBroker: MessageBroker, private logger: Logger) {
    this.messageBroker.initialize({
      brokers: [process.env.KAFKA_BROKER_HOST || 'localhost:9092'],
    });
  }

  initialize = (
    entity: IEntityConstructor<Entity>,
    url: string,
    name: string,
    topicName: string,
    initFunctions: any[] = [],
    minNumberOfEventsToCreateSnapshot: number = 100,
  ): Promise<any> => {
    return new Promise(async (res, rej) => {
      try {
        this.hasInitializedBeenCalled = true;
        this.snapshotThreshold = minNumberOfEventsToCreateSnapshot;
        this._Entity = entity;
        this.namespace = name;
        this.topicName = topicName;

        this.logger.debug(`initialize ${this.namespace} event repository (${url})`);

        this.client = await retry(async () => {
          this.logger.debug(`retry to connect to ${this.namespace} database`);
          const connection = await MongoClient.connect(url, {
            w: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          return connection;
        });
        this.db = this.client.db(this.namespace);
        this.logger.debug(`connected to ${this.namespace} database`);

        this.db.on('close', () => {
          this.logger.debug(`disconnected from ${this.namespace} database`);
        });

        this.eventCollection = this.db.collection(`${this.namespace}_events`);
        this.snapshotCollection = this.db.collection(`${this.namespace}_snapshots`);
        this.counterCollection = this.db.collection(`${this.namespace}_counters`);

        await this.eventCollection.createIndexes([
          {
            key: { aggregateId: 1 },
            name: `${this.namespace}_aggregateId`,
          },
          {
            key: { aggregateId: 1, eventNumber: 1 },
            name: `${this.namespace}_aggregateId_eventNumber`,
            unique: true,
          },
        ]);

        await this.snapshotCollection.createIndexes([
          {
            key: { aggregateId: 1 },
            unique: true,
          },
        ]);

        try {
          await this.counterCollection.insertOne({ _id: 'events', seq: 0 });
        } catch (error) {
          if (!(error.code === 11000 && error.message.includes('index: _id_ dup key:'))) {
            throw error;
          }
        }

        await Promise.all(initFunctions.map(f => f()));

        this.logger.debug(`${name} event repository initialized`);
        this.hasInitialized = true;
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  getDatabase = async (): Promise<Db> => {
    await this.waitUntilInitialized();
    return this.client.db(this.namespace);
  };

  save = async (entity: Entity) => {
    await this.waitUntilInitialized();
    const streamId: string = entity.currentState.id;
    const lastPersistedEvent = await this.getLastEventOfStream(streamId);
    let eventNumber = (lastPersistedEvent && lastPersistedEvent.eventNumber) || 0;
    if (lastPersistedEvent && entity.lastPersistedEventId !== lastPersistedEvent.id) {
      throw new Error('concurrency issue!');
    }

    const eventsToInsert: IEvent[] = entity.pendingEvents.map(event => {
      eventNumber = eventNumber + 1;
      return { ...event, eventNumber };
    });

    const appendedEvents = await Promise.all(eventsToInsert.map(event => this.appendEvent(event)));
    this.logger.debug(
      `saved ${appendedEvents.length} ${appendedEvents.length === 1 ? 'event' : 'events'} into ${
        this.namespace
      } event store`,
    );

    await Promise.all(
      appendedEvents.map(e =>
        this.messageBroker.send(this.topicName, [{ value: JSON.stringify(e) }]),
      ),
    );

    for (const event of appendedEvents) {
      if (event.eventNumber % this.snapshotThreshold === 0) {
        await this.saveSnapshot(event.aggregateId);
      }
    }
    return entity.confirmEvents();
  };

  // FIXME I think this should return promise of entity or null?
  findById = async (id: string): Promise<Entity> => {
    await this.waitUntilInitialized();
    const snapshot = await this.getSnapshot(id);

    const events: IEvent[] = await (snapshot
      ? this.getEventsAfterSnapshot(snapshot)
      : this.getEventStream(id));

    const entity = new this._Entity(snapshot || undefined);
    entity.pushEvents(...events);
    if (!entity.currentState.id) {
      throw new EntityError(
        `Event repository couldn't find entity with id: ${id}`,
        HttpStatusCodes.NotFound,
      );
    }

    this.logger.debug(`found entity with id: ${id}`);
    return entity.confirmEvents();
  };

  generateUniqueId = (longId: boolean = true): Promise<string> => {
    const checkAvailability = async (resolve: (id: string) => any) => {
      await this.waitUntilInitialized();
      const id = longId ? Identifier.makeLongId() : Identifier.makeUniqueId();
      const result = await this.eventCollection.findOne({ aggregateId: id });
      result ? await checkAvailability(resolve) : resolve(id);
    };
    return new Promise(resolve => checkAvailability(resolve));
  };

  private getNextSequence = async () => {
    const counter = await this.counterCollection.findOneAndUpdate(
      { _id: 'events' },
      {
        $inc: { seq: 1 },
      },
      { returnOriginal: false },
    );

    return counter.value.seq;
  };

  private getLastEventOfStream = async (streamId: string): Promise<IEvent | null> => {
    const result = await this.eventCollection.find(
      {
        aggregateId: streamId,
      },
      {
        sort: { eventNumber: -1 },
        limit: 1,
      },
    );
    const event = (await result.toArray())[0];
    return event ? renameObjectProperty(event, '_id', 'id') : null;
  };

  private appendEvent = async (event: IEvent): Promise<IEvent> => {
    const seq = await this.getNextSequence();

    const payload = renameObjectProperty(event, 'id', '_id');
    const result = await this.eventCollection.insertOne({
      ...payload,
      position: seq,
    });
    return renameObjectProperty(result.ops[0], '_id', 'id');
  };

  private getSnapshot = async (streamId: string): Promise<ISnapshot | null> => {
    return this.snapshotCollection.findOne({ aggregateId: streamId });
  };

  private getEventStream = async (streamId: string, from: number = 1, to: number = 2 ** 31 - 1) => {
    const result = await this.eventCollection.find(
      {
        $and: [
          { aggregateId: streamId },
          { eventNumber: { $gte: from } },
          { eventNumber: { $lte: to } },
        ],
      },
      { sort: { eventNumber: 1 } },
    );
    const events = await result.toArray();
    return events.map(e => renameObjectProperty(e, '_id', 'id'));
  };

  private getEventsAfterSnapshot = async (snapshot: ISnapshot): Promise<IEvent[]> => {
    const streamId = snapshot.state.id;
    const lastEventId = snapshot.lastEventId;

    const lastEvent: IEvent | null = await this.eventCollection.findOne({
      _id: lastEventId,
    });
    if (!lastEvent) {
      return [];
    }
    const lastEventNumber = lastEvent.eventNumber;

    return this.getEventStream(streamId, lastEventNumber);
  };

  private saveSnapshot = async (streamId: string): Promise<boolean> => {
    const entity = await this.findById(streamId);
    const lastEvent = await this.getLastEventOfStream(streamId);
    if (!lastEvent) {
      return false;
    }
    await this.snapshotCollection.updateOne(
      { aggregateId: streamId },
      {
        $set: {
          aggregateId: streamId,
          lastEventId: lastEvent.id,
          state: entity.persistedState,
        },
      },
      { upsert: true },
    );
    this.logger.debug(`saved ${this.namespace} snapshot for stream: ${streamId}`);
    return true;
  };

  private waitUntilInitialized = (): Promise<boolean> => {
    return new Promise(async res => {
      if (!this.hasInitializedBeenCalled) {
        throw new Error(
          `You need to call ${this.initialize.name} in the constructor of the EventRepository`,
        );
      }
      if (this.hasInitialized) {
        return res(true);
      }
      // tslint:disable-next-line:no-return-await
      await retry(async () => await this.initialize);
      res(true);
    });
  };
}
