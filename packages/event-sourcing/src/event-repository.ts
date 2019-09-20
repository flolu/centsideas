import * as retry from 'async-retry';
import { injectable } from 'inversify';
import { MongoClient, Db, Collection } from 'mongodb';
import { EventEmitter } from 'events';
import { Kafka, logLevel, Producer, KafkaConfig, Message, RecordMetadata, Consumer } from 'kafkajs';

import { Identifier, renameObjectProperty, Logger } from '@cents-ideas/utils';

import { IEventEntity } from './event-entity';
import { ISnapshot } from './snapshot';
import { IEvent } from '.';

export interface IEntityConstructor<Entity> {
  new (snapshot?: ISnapshot): Entity;
}

@injectable()
export class MessageBroker {
  private readonly defaultConfig = {
    clientId: 'cents-ideas',
    brokers: ['172.18.0.1:9092'],
    logLevel: logLevel.WARN,
    retry: {
      initialRetryTime: 300,
      retries: 10,
    },
  };
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private logger: Logger) {}

  initialize = (overrides: Partial<KafkaConfig> = {}) => {
    this.kafka = new Kafka({ ...this.defaultConfig, ...overrides });
  };

  send = async (topic: string = 'test-topic', messages: Message[] = []): Promise<RecordMetadata[]> => {
    if (!this.producer) {
      this.producer = this.kafka.producer();
    }
    // FIXME does it reconnect if it is already connected?
    await this.producer.connect();
    return this.producer.send({ topic, messages });
  };

  subscribe = async (topic: string = 'test-topic') => {
    if (!this.consumer) {
      // FIXME does the group need to be unique?
      this.consumer = this.kafka.consumer({
        groupId: 'test-group' + Number(Date.now()).toString(),
        rebalanceTimeout: 1000,
      });
    }
    await this.consumer.connect();
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const payload = JSON.parse(message.value.toString());
        this.logger.info(`consumed ${payload.name} event`);
      },
    });
  };
}

// FIXME logging
@injectable()
export abstract class EventRepository<Entity extends IEventEntity> extends EventEmitter {
  protected _Entity: IEntityConstructor<Entity>;

  private client: MongoClient;
  private db: Db;
  private eventCollection: Collection;
  private snapshotCollection: Collection;
  private counterCollection: Collection;
  private namespace: string;
  private readonly minNumberOfEventsToCreateSnapshot = 5;

  constructor(private messageBroker: MessageBroker, private logger: Logger) {
    super();
    this.messageBroker.initialize();
  }

  // FIXME build mechanism that makes sure initialized has been finished before doing anything else
  initialize = async (entity: IEntityConstructor<Entity>, url: string, name: string) => {
    this.logger.debug(`initialize ${name} event repository (${url})`);

    this._Entity = entity;
    this.namespace = name;

    this.client = await retry(async () => {
      const connection = await MongoClient.connect(url, { w: 1, useNewUrlParser: true, useUnifiedTopology: true });
      return connection;
    });
    this.db = this.client.db(name);
    this.logger.debug(`connected to ${name} database`);

    this.db.on('close', () => {
      this.logger.info(`disconnected from ${name} database`);
      this.emit('disconnect');
    });

    this.eventCollection = this.db.collection(`${name}_events`);
    this.snapshotCollection = this.db.collection(`${name}_snapshots`);
    this.counterCollection = this.db.collection(`${name}_counters`);

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

    // TODO try to understand this properly
    try {
      await this.counterCollection.insertOne({ _id: 'events', seq: 0 });
    } catch (error) {
      if (error.code === 11000 && error.message.includes('_counters index: _id_ dup key')) {
        return;
      }
      throw error;
    }

    this.logger.debug(`${name} event repository initialized`);
  };

  save = async (entity: Entity) => {
    const streamId: string = entity.currentState.id;
    const lastPersistedEvent = await this.getLastEventOfStream(streamId);
    let eventNumber = (lastPersistedEvent && lastPersistedEvent.eventNumber) || 0;
    if (lastPersistedEvent && entity.lastPersistedEventId !== lastPersistedEvent.id) {
      // FIXME retry once (issue: command handler has to retry, not save)
      throw new Error('concurrency issue!');
    }

    let eventsToInsert: IEvent[] = entity.pendingEvents.map(event => {
      eventNumber = eventNumber + 1;
      return { ...event, eventNumber };
    });

    const appendedEvents = await Promise.all(eventsToInsert.map(event => this.appendEvent(event)));
    this.logger.debug(
      `saved ${appendedEvents.length} ${appendedEvents.length === 1 ? 'event' : 'events'} into ${
        this.namespace
      } event store`,
    );

    await Promise.all(appendedEvents.map(e => this.messageBroker.send('test-topic', [{ value: JSON.stringify(e) }])));

    for (const event of appendedEvents) {
      if (event.eventNumber % this.minNumberOfEventsToCreateSnapshot === 0) {
        this.saveSnapshot(event.aggregateId);
      }
    }

    return entity.confirmEvents();
  };

  findById = async (id: string): Promise<Entity> => {
    const snapshot = await this.getSnapshot(id);

    const events: IEvent[] = await (snapshot ? this.getEventsAfterSnapshot(snapshot) : this.getEventStream(id));

    const entity = new this._Entity(snapshot);
    entity.pushEvents(...events);
    if (!entity.currentState.id) {
      throw entity.NotFoundError(id);
    }

    this.logger.debug(`found entity with id: ${id}`);
    return entity.confirmEvents();
  };

  generateUniqueId = (): Promise<string> => {
    const checkAvailability = async (resolve: Function) => {
      const id = Identifier.makeUniqueId();
      const result = await this.eventCollection.findOne({ aggregateId: id });
      result ? checkAvailability(resolve) : resolve(id);
    };
    return new Promise(resolve => checkAvailability(resolve));
  };

  async getNextSequence(name: string) {
    const counter = await this.counterCollection.findOneAndUpdate(
      { _id: name },
      {
        $inc: { seq: 1 },
      },
      { returnOriginal: false },
    );

    return counter.value.seq;
  }

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
    const seq = await this.getNextSequence('events');

    const payload = renameObjectProperty(event, 'id', '_id');
    const result = await this.eventCollection.insertOne({ ...payload, position: seq });
    return result.ops[0];
  };

  getSnapshot = async (streamId: string): Promise<ISnapshot | null> => {
    return this.snapshotCollection.findOne({ aggregateId: streamId });
  };

  private getEventStream = async (streamId: string, from: number = 1, to: number = 2 ** 31 - 1) => {
    const result = await this.eventCollection.find(
      {
        $and: [{ aggregateId: streamId }, { eventNumber: { $gte: from } }, { eventNumber: { $lte: to } }],
      },
      { sort: { eventNumber: 1 } },
    );
    const events = await result.toArray();
    return events.map(e => renameObjectProperty(e, '_id', 'id'));
  };

  private getEventsAfterSnapshot = async (snapshot: ISnapshot): Promise<IEvent[]> => {
    const streamId = snapshot.state.id;
    const lastEventId = snapshot.lastEventId;

    const lastEvent: IEvent = await this.eventCollection.findOne({ _id: lastEventId });
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
      { $set: { aggregateId: streamId, lastEventId: lastEvent.id, state: entity.persistedState } },
      { upsert: true },
    );
    this.logger.debug(`saved ${this.namespace} snapshot for stream: ${streamId}`);
    return true;
  };
}
