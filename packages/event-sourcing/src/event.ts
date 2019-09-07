export interface IEvent<T> {
  id: string;
  name: string;
  data: T;
  timestamp: string;
  // TODO event number
  eventNumber: number;
}

export class Event<T> implements IEvent<T> {
  readonly id: string;
  readonly name: string;
  readonly data: T;
  readonly timestamp: string;
  readonly eventNumber: number;

  constructor(name: string, data: T, eventNumber?: number) {
    // NEXT random id generate
    this.id = 'random-id-' + Date.now().toString();
    this.name = name;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.eventNumber = eventNumber || -1;
  }
}
