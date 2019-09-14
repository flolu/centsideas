import { Reducer } from './reducer';
import { IEvent } from './event';

export abstract class EventEntity<IEntityState> {
  lastPersistedEventId: string | null = null;
  persistedState: IEntityState;
  pendingEvents: IEvent[] = [];

  protected reducer: Reducer<IEntityState>;

  constructor(knownEvents: any, initialState: IEntityState) {
    this.reducer = new Reducer<IEntityState>(knownEvents);
    this.persistedState = initialState;
  }

  pushEvents = (...events: IEvent[]) => {
    this.pendingEvents = this.pendingEvents.concat(events);
    return this;
  };

  confirmEvents = () => {
    this.persistedState = this.reducer.reduce(this.persistedState, this.pendingEvents);
    this.lastPersistedEventId = this.pendingEvents[this.pendingEvents.length - 1].id;
    this.pendingEvents = [];
    return this;
  };

  get currentState(): IEntityState {
    return this.reducer.reduce(this.persistedState, this.pendingEvents);
  }
}
