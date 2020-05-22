import {Id, ISODate} from '@centsideas/types';

import {EventStore} from './event-store';
import {Aggregate} from './aggregate';
import {DomainEvent} from './domain-event';
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue';
import {StreamEvents} from './stream-event';
import {EventId} from './event-id';
import {PersistedEvent} from './persisted-event';

// TODO snapshots (probably not into event store: https://eventstore.com/docs/event-sourcing-basics/rolling-snapshots/index.html)
// TODO event dispatcher
export abstract class InMemoryEventStore<T extends Aggregate> extends EventStore<T> {
  private events: PersistedEvent[] = [];
  private sequence: number = 0;

  async getStream(id: Id) {
    const rawEvents = this.events
      .filter(e => id.toString() === e.streamId)
      .sort((a, b) => a.version - b.version);

    const events: DomainEvent[] = rawEvents.map((e: PersistedEvent) =>
      this.deserialize(e.name, e.data),
    );
    return events;
  }

  async store(events: StreamEvents, lastVersion: number) {
    const lastStoredEvent = await this.getLastEvent(events.aggregateId);
    if (lastStoredEvent && lastStoredEvent.version !== lastVersion) {
      // TODO retry command (maybe orchestrated by command bus?!)
      throw new OptimisticConcurrencyIssue();
    }

    events.toArray().forEach(e => {
      this.sequence++;
      this.events.push({
        id: EventId.generate().toString(),
        streamId: events.aggregateId.toString(),
        version: e.version.toNumber(),
        name: e.event.eventName,
        data: e.event.serialize(),
        insertedAt: ISODate.now().toString(),
        sequence: this.sequence,
        metadata: null,
      });
    });
  }

  private async getLastEvent(streamId: Id) {
    return this.events
      .filter(e => streamId.toString() === e.streamId)
      .sort((a, b) => b.version - a.version)[0];
  }

  private deserialize(eventName: string, data: any): DomainEvent {
    return this.eventMap[eventName].deserialize(data);
  }
}
