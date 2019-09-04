export interface IEvent<T> {
  id: string;
  name: string;
  data: T;
  timestamp: string;
}

export class Event<T> implements IEvent<T> {
  readonly id: string;
  readonly name: string;
  readonly data: T;
  readonly timestamp: string;

  constructor(name: string, data: T, id?: string) {
    // NEXT random id generate
    this.id = id || 'random-id-' + Date.now().toString();
    this.name = name;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
