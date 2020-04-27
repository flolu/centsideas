export interface IEvent<IData = any> {
  id: string;
  aggregateId: string;
  name: string;
  data: IData;
  timestamp: string;
  eventNumber: number;
}
