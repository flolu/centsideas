import {inject} from 'inversify';
import {MongoClient} from 'mongodb';
import * as asyncRetry from 'async-retry';

import {Id, ISODate} from '@centsideas/types';

import {EventStore} from './event-store';
import {PersistedEvent} from './persisted-event';
import {StreamEvents} from './stream-event';
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue';
import {EventId} from './event-id';
import {EventDispatcher} from './event-dispatcher';
import {EVENT_NAME_METADATA} from './domain-event';

// TODO consider factory
export abstract class MongoEventStore implements EventStore {
  abstract topic: string;

  private client = new MongoClient(this.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  @inject(EventDispatcher) private dispatcher!: EventDispatcher;

  constructor(private databaseUrl: string, private databaseName: string) {}

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
      // TODO retry command (maybe orchestrated by command bus?!)
      throw new OptimisticConcurrencyIssue();
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

    await this.dispatcher.dispatch(
      this.topic,
      inserts.map(event => ({
        key: events.aggregateId.toString(),
        // TODO serializer for whole event
        value: JSON.stringify(event),
        headers: {eventName: event.name},
      })),
    );
  }

  async getEvents(from: number) {
    const collection = await this.eventsCollection();
    const result = await collection.find({sequence: {$gte: from}}, {sort: {sequence: -1}});
    return result.toArray();
  }

  private async getSequenceBookmark() {
    const collection = await this.eventsCollection();
    const result = await collection.find({}, {sort: {sequence: -1}, limit: 1});
    const events = await result.toArray();
    return events[0].sequence;
  }

  private async getLastEvent(id: Id) {
    const collection = await this.eventsCollection();
    const result = await collection.find(
      {streamId: id.toString()},
      {sort: {eventNumber: -1}, limit: 1},
    );
    const events = await result.toArray();
    return events[0];
  }

  private async eventsCollection() {
    const db = await this.db();
    return db.collection<PersistedEvent>('events');
  }

  private async db() {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.databaseName);
  }
}
