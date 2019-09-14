import { Identifier } from '@cents-ideas/utils';

export interface IEvent {
  id: string;
  aggregateId: string;
  name: string;
  // FIXME event data type
  data: any;
  timestamp: string;
  eventNumber: number;
}

export class Event<IData> implements IEvent {
  readonly id: string;
  readonly aggregateId: string;
  readonly name: string;
  readonly data: IData;
  readonly timestamp: string;
  readonly eventNumber: number;

  constructor(name: string, data: IData, aggregateId: string) {
    this.id = Identifier.makeUniqueId();
    this.aggregateId = aggregateId;
    this.name = name;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.eventNumber = -1;
  }
}
