import {inject} from 'inversify';

import {Id, ISODate} from '@centsideas/types';

import {EventStore} from './event-store';
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue';
import {StreamEvents} from './stream-event';
import {EventId} from './event-id';
import {PersistedEvent} from './persisted-event';
import {EventDispatcher} from './event-dispatcher';

export abstract class InMemoryEventStore implements EventStore {
  abstract topic: string;

  private events: PersistedEvent[] = [];
  private sequence: number = 0;

  @inject(EventDispatcher) private dispatcher!: EventDispatcher;

  async getStream(id: Id) {
    return this.events
      .filter(e => id.toString() === e.streamId)
      .sort((a, b) => a.version - b.version);
  }

  async store(events: StreamEvents, lastVersion: number) {
    const lastStoredEvent = await this.getLastEvent(events.aggregateId);
    if (lastStoredEvent && lastStoredEvent.version !== lastVersion) {
      // TODO retry command (maybe orchestrated by command bus?!)
      throw new OptimisticConcurrencyIssue();
    }

    const toInsert = events.toArray().map(event => {
      this.sequence++;
      return {
        id: EventId.generate().toString(),
        streamId: events.aggregateId.toString(),
        version: event.version.toNumber(),
        name: event.event.eventName,
        data: event.event.serialize(),
        insertedAt: ISODate.now().toString(),
        sequence: this.sequence,
      };
    });

    toInsert.forEach(e => this.events.push(e));

    await this.dispatcher.dispatch(
      this.topic,
      toInsert.map(event => ({
        key: events.aggregateId.toString(),
        // TODO serializer for whole event
        value: JSON.stringify(event),
        headers: {eventName: event.name},
      })),
    );
  }

  async getEvents(from: number = 0) {
    return this.events
      .filter(event => event.sequence >= from)
      .sort((a, b) => a.version - b.version);
  }

  private async getLastEvent(streamId: Id) {
    return this.events
      .filter(e => streamId.toString() === e.streamId)
      .sort((a, b) => b.version - a.version)[0];
  }
}
