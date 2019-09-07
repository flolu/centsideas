import { KnownEvents, Reducer } from './reducer';
import { IEvent } from './event';

export interface IEventEntity {
  id: string;
  state: any;
  events: IEvent<any>[];
  persistedEvents: IEvent<any>[];
  pendingEvents: IEvent<any>[];
  pushNewEvents(events: IEvent<any>[]): any;
  setPersistedEvents(events: IEvent<any>[]): any;
  confirmEvents(): any;
}

export interface IEntityConstructor<Entity> {
  new (events?: IEvent<any>[]): Entity;
}

export abstract class EventEntity<T> {
  persistedEvents: IEvent<T>[] = [];
  pendingEvents: IEvent<T>[] = [];
  id: string = '';

  protected reducer: Reducer<T>;

  constructor(knownEvents: KnownEvents<T>) {
    this.reducer = new Reducer<T>(knownEvents);
  }

  get state(): any {
    throw new Error('Method not implemented.');
  }

  get events() {
    return [...this.persistedEvents, ...this.pendingEvents];
  }

  setPersistedEvents(events: IEvent<any>[]) {
    // FIXME use spread operator in function arguments
    this.persistedEvents = events;
    this.updateState();
    return this;
  }

  pushNewEvents(events: IEvent<any>[]) {
    this.pendingEvents = this.pendingEvents.concat(events);
    this.updateState();
    return this;
  }

  // TODO make use of this method
  confirmEvents() {
    this.persistedEvents = [...this.persistedEvents, ...this.pendingEvents];
    this.pendingEvents = [];
    return this;
  }

  private updateState() {
    const state = this.state;

    for (const propertyName of Object.keys(state)) {
      (this as any)[propertyName] = state[propertyName];
    }
  }
}
