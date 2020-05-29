import {inject, interfaces, injectable} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {Id, ISODate} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';

import {EventStore} from './event-store';
import {StreamEvents} from './stream-event';
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue';
import {EventId} from './event-id';
import {EventDispatcher} from './event-bus';
import {EVENT_NAME_METADATA} from './domain-event';
import {EventStoreFactoryOptions} from './interfaces';

@injectable()
export class MongoEventStore implements EventStore {
  private topic!: EventTopics;
  private databaseUrl!: string;
  private databaseName!: string;
  private client!: MongoClient;
  private collectionName = 'events';

  @inject(EventDispatcher) private dispatcher!: EventDispatcher;

  initilize(topic: EventTopics, url: string, name: string) {
    this.topic = topic;
    this.databaseUrl = url;
    this.databaseName = name;
    this.client = new MongoClient(this.databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  // TODO what if stream with this id does not exist?
  async getStream(id: Id) {
    const collection = await this.eventsCollection();
    const result = await collection.find({streamId: id.toString()}).sort({version: -1});
    const events = await result.toArray();
    return events;
  }

  async store(events: StreamEvents, lastVersion: number) {
    if (!events.toArray().length) return;

    const lastEvent = await this.getLastEvent(events.aggregateId);
    if (lastEvent && lastEvent.version !== lastVersion) {
      throw new OptimisticConcurrencyIssue(
        this.databaseUrl,
        events.aggregateId.toString(),
        lastVersion,
        lastEvent.sequence,
        lastEvent.id,
      );
    }

    let currentSequence = await this.getSequenceBookmark();
    const inserts = events.toArray().map(streamEvent => {
      currentSequence++;
      const persisted: PersistedEvent = {
        id: EventId.generate().toString(),
        streamId: events.aggregateId.toString(),
        version: streamEvent.version.toNumber(),
        name: Reflect.getMetadata(EVENT_NAME_METADATA, streamEvent.event),
        data: streamEvent.event.serialize(),
        insertedAt: ISODate.now().toString(),
        sequence: currentSequence,
      };
      return persisted;
    });

    const collection = await this.eventsCollection();
    await collection.insertMany(inserts);

    await this.dispatcher.dispatch(this.topic, inserts);
  }

  async getEvents(from: number) {
    const collection = await this.eventsCollection();
    const result = await collection.find({sequence: {$gt: from}}, {sort: {sequence: 1}});
    return result.toArray();
  }

  private async getSequenceBookmark() {
    const collection = await this.eventsCollection();
    const result = await collection.find({}, {sort: {sequence: -1}, limit: 1});
    const events = await result.toArray();
    if (!events.length) return 0;
    return events[0].sequence;
  }

  private async getLastEvent(id: Id) {
    const collection = await this.eventsCollection();
    const result = await collection.find(
      {streamId: id.toString()},
      {sort: {version: -1}, limit: 1},
    );
    const events = await result.toArray();
    return events[0];
  }

  private async eventsCollection() {
    const db = await this.db();
    return db.collection<PersistedEvent>(this.collectionName);
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.databaseName);
  }
}

export type MongoEventStoreFactory = (options: EventStoreFactoryOptions) => MongoEventStore;
export const mongoEventStoreFactory = (context: interfaces.Context): MongoEventStoreFactory => {
  return ({url, name, topic}) => {
    const store = context.container.get(MongoEventStore);
    store.initilize(topic, url, name);
    return store;
  };
};
