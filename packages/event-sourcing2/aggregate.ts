import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {StreamEvents} from './stream-event';
import {IDomainEvent, EVENT_NAME_METADATA, eventDeserializerMap} from './domain-event';
import {PersistedEvent} from './persisted-event';

export abstract class Aggregate {
  protected abstract id: Id;

  private events: StreamEvents | undefined;
  private version = StreamVersion.start();
  private persistedVersion = StreamVersion.start();

  flushEvents() {
    const events = this.events || StreamEvents.empty(this.id);
    this.events = StreamEvents.empty(this.id);
    return events;
  }

  protected replay(events: PersistedEvent[]) {
    events.forEach(event => {
      const deserialize = eventDeserializerMap.get(event.name);
      this.apply(deserialize(event.data), true);
    });
  }

  protected raise(event: IDomainEvent) {
    this.apply(event);
    if (!this.events) this.events = StreamEvents.empty(this.id);
    this.events.add(event, this.version);
  }

  protected apply(event: IDomainEvent, inReplay = false) {
    const eventName = Reflect.getMetadata(EVENT_NAME_METADATA, event);
    const methodName = Reflect.getMetadata(eventName, this);
    if (methodName) (this as any)[methodName](event);

    if (inReplay) this.persistedVersion.next();
    this.version.next();
  }

  get persistedAggregateVersion() {
    return this.persistedVersion.toNumber();
  }

  get aggregateVersion() {
    return this.version.toNumber();
  }
}

export type AggregateClassConstructor<T extends Aggregate> = new (events: IDomainEvent[]) => T;
