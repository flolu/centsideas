import { Identifier } from '@cents-ideas/utils';

export interface IEvent<IData = any> {
  id: string;
  aggregateId: string;
  name: string;
  data: IData;
  timestamp: string;
  eventNumber: number;
}

export class Event<IData> implements IEvent<IData> {
  readonly id: string;
  readonly aggregateId: string;
  readonly name: string;
  readonly data: IData;
  readonly timestamp: string;
  readonly eventNumber: number;

  constructor(name: string, data: IData, aggregateId: string) {
    // FIXME use longer ids for events (safer, doesn't matter if look ugly)
    this.id = Identifier.makeUniqueId();
    this.aggregateId = aggregateId;
    this.name = name;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.eventNumber = -1;
  }
}
