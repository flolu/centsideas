import { Identifier } from '@cents-ideas/utils';

export interface IEvent<T> {
  id: string;
  aggregateId: string;
  name: string;
  data: T;
  timestamp: string;
  eventNumber: number;
}

export class Event<T> implements IEvent<T> {
  readonly id: string;
  readonly aggregateId: string;
  readonly name: string;
  readonly data: T;
  readonly timestamp: string;
  readonly eventNumber: number;

  constructor(name: string, data: T, aggregateId: string) {
    this.id = Identifier.makeUniqueId();
    this.aggregateId = aggregateId;
    this.name = name;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.eventNumber = -1;
  }
}
