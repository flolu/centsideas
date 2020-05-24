import {inject} from 'inversify';

import {Id, ISODate} from '@centsideas/types';

import {EventStore} from './event-store';
import {Aggregate} from './aggregate';
import {DomainEvent} from './domain-event';
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue';
import {StreamEvents} from './stream-event';
import {EventId} from './event-id';
import {PersistedEvent} from './persisted-event';
import {EventDispatcher} from './event-dispatcher';

// TODO snapshots (probably not into event store: https://eventstore.com/docs/event-sourcing-basics/rolling-snapshots/index.html)
export abstract class InMemoryEventStore<T extends Aggregate> extends EventStore<T> {
  private events: PersistedEvent[] = [];
  private sequence: number = 0;

  @inject(EventDispatcher) private dispatcher!: EventDispatcher;

  async buildAggregate(id: Id) {
    const rawEvents = this.events
      .filter(e => id.toString() === e.streamId)
      .sort((a, b) => a.version - b.version);
    const domainEvents = rawEvents.map(e => this.deserialize(e.name, e.data));
    return (this.aggregate as any).buildFrom(domainEvents);
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

  private deserialize(eventName: string, data: object): DomainEvent {
    return this.eventMap[eventName].deserialize(data);
  }
}
