import {Id} from '@centsideas/types';

import {StreamEvents} from './stream-event';
import {DomainEvent, DomainEventInstance} from './domain-event';
import {Aggregate} from './aggregate';
import {PersistedEvent} from './persisted-event';

type AggregateClassConstructor<T extends Aggregate> = new (events: DomainEvent[]) => T;

export abstract class EventStore<T extends Aggregate> {
  protected abstract eventMap: Record<string, DomainEventInstance<any>>;
  protected abstract aggregate: AggregateClassConstructor<T>;
  protected abstract topic: string;

  abstract buildAggregate(id: Id, build: (events: DomainEvent[]) => T): Promise<T>;
  abstract getEvents(from: number): Promise<PersistedEvent[]>;
  abstract store(events: StreamEvents, lastVersion: number): Promise<void>;
}
