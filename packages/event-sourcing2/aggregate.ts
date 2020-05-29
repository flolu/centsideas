import {Id} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';

import {StreamVersion} from './stream-version';
import {StreamEvents} from './stream-event';
import {
  IDomainEvent,
  EVENT_NAME_METADATA,
  eventDeserializerMap,
  DomainEventInstance,
} from './domain-event';

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

  get persistedAggregateVersion() {
    return this.persistedVersion.toNumber();
  }

  get aggregateVersion() {
    return this.version.toNumber();
  }
}

export type AggregateClassConstructor<T extends Aggregate> = new (events: IDomainEvent[]) => T;

/**
 * Takes an event class as an argument of the decorator
 * The method which is decorated will be called to handle
 * the aggregates state update
 */
export const Apply = (Event: DomainEventInstance<any>) => {
  return function ApplyDecorator(target: any, methodName: string) {
    /**
     * Get the event's name from the metadata saved on the
     * class of the event
     */
    const eventName = Reflect.getMetadata(EVENT_NAME_METADATA, Event.prototype);
    /**
     * Save the @param methodName of the handler method
     * on the @param target class and associate it with the
     * @param eventName
     *
     * This metadata is used in the @method apply of the
     * aggragate base class
     */
    Reflect.defineMetadata(eventName, methodName, target);
  };
};
