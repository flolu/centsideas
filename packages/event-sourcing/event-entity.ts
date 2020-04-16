import { Reducer } from './reducer';
import { IEvent, Event } from './event';

export interface IEventEntity {
  lastPersistedEventId: string | null;
  persistedState: any;
  pendingEvents: IEvent[];
  pushEvents(...events: IEvent[]): any;
  confirmEvents(): any;
  currentState: any;
}

export interface IEventCommitFunctions<IEntityState> {
  [name: string]: (state: IEntityState, event: Event<any>) => IEntityState;
}

export abstract class EventEntity<IEntityState> implements IEventEntity {
  lastPersistedEventId: string | null = null;
  persistedState: IEntityState;
  pendingEvents: IEvent[] = [];

  protected reducer: Reducer<IEntityState>;

  constructor(knownEvents: IEventCommitFunctions<IEntityState>, initialState: IEntityState) {
    this.reducer = new Reducer<IEntityState>(knownEvents);
    this.persistedState = initialState;
  }

  pushEvents = (...events: IEvent[]): EventEntity<IEntityState> => {
    // FIXME check if the events are valid (are known to the commitFunctions)
    // FIXME also check if the event payload is valid (e.g. aggregateid)
    this.pendingEvents = this.pendingEvents.concat(events);
    return this;
  };

  confirmEvents = (): EventEntity<IEntityState> => {
    this.persistedState = this.reducer.reduce(this.persistedState, this.pendingEvents);
    if (this.pendingEvents.length) {
      this.lastPersistedEventId = this.pendingEvents[this.pendingEvents.length - 1].id;
      this.pendingEvents = [];
    }
    return this;
  };

  get currentState(): IEntityState {
    return this.reducer.reduce(this.persistedState, this.pendingEvents);
  }
}
