import {Id} from '@centsideas/types';

import {StreamEvents} from './stream-event';
import {DomainEvent, DomainEventInstance} from './domain-event';
import {Aggregate} from './aggregate';

type AggregateClassConstructor<T extends Aggregate> = new (events: DomainEvent[]) => T;

export abstract class EventStore<T extends Aggregate> {
  protected abstract eventMap: Record<string, DomainEventInstance>;
  protected abstract aggregate: AggregateClassConstructor<T>;

  protected abstract getStream(id: Id): Promise<DomainEvent[]>;
  protected abstract store(events: StreamEvents, lastVersion: number): Promise<void>;
}
