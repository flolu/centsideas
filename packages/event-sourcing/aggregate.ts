import {Id} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';

import {StreamVersion} from './stream-version';
import {StreamEvents} from './stream-event';
import {IDomainEvent, EVENT_NAME_METADATA, eventDeserializerMap} from './domain-event';
import {PersistedSnapshot} from './snapshot';

export abstract class Aggregate<SerializedState = object> {
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
    // TODO check if version matches
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
    /**
     * The event name metadata is set by the @DomainEvent decorator
     * on application start for each event class
     */
    const eventName = Reflect.getMetadata(EVENT_NAME_METADATA, event);
    /**
     * Get the method name of the event handler method
     * based on the event's name from @param this class instance
     *
     * This metadata is set by the @Apply decorator from of the
     * handler method
     */
    const methodName = Reflect.getMetadata(eventName, this);
    if (methodName) (this as any)[methodName](event);

    if (inReplay) this.persistedVersion.next();
    this.version.next();
  }

  protected applySnapshot(
    snapshot: PersistedSnapshot<SerializedState>,
    eventsAfterSnapshot: PersistedEvent[],
  ) {
    this.deserialize(snapshot.data);
    this.version = StreamVersion.fromNumber(snapshot.version);
    this.persistedVersion = StreamVersion.fromNumber(snapshot.version);
    this.replay(eventsAfterSnapshot);
  }

  protected abstract deserialize(data: SerializedState): void;
  protected abstract serialize(): SerializedState;

  get persistedAggregateVersion() {
    return this.persistedVersion.toNumber();
  }

  get aggregateVersion() {
    return this.version.toNumber();
  }

  get aggregateId() {
    return this.id;
  }

  get snapshot(): PersistedSnapshot<SerializedState> {
    return {
      aggregateId: this.aggregateId.toString(),
      version: this.version.toNumber(),
      data: this.serialize(),
    };
  }
}

export type AggregateClassConstructor<T extends Aggregate> = new (events: IDomainEvent[]) => T;
