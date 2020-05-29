// TODO remove eventually
export interface IEvent<IData = any> {
  id: string;
  aggregateId: string;
  name: string;
  data: IData;
  timestamp: string;
  eventNumber: number;
}

export interface PersistedEvent<T = object> {
  id: string;
  streamId: string;
  version: number;
  name: string;
  data: T;
  insertedAt: string;
  sequence: number;
}
