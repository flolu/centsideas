import { Reducer } from './reducer';
import { IEvent } from './event';
import { Event } from './event';

export interface IEventEntity {
  lastPersistedEventId: string | null;
  persistedState: any;
  pendingEvents: IEvent[];
  pushEvents(...events: IEvent[]): any;
  confirmEvents(): any;
  currentState: any;
  NotFoundError: any;
}

export interface IEventCommitFunctions<IEntityState> {
  [name: string]: (state: IEntityState, event: Event<any>) => IEntityState;
}

export abstract class EventEntity<IEntityState> implements IEventEntity {
  lastPersistedEventId: string | null = null;
  persistedState: IEntityState;
  pendingEvents: IEvent[] = [];

  protected reducer: Reducer<IEntityState>;

  // FIXME do i really need @param NotFoundError
  constructor(knownEvents: IEventCommitFunctions<IEntityState>, initialState: IEntityState, public NotFoundError: any) {
    this.reducer = new Reducer<IEntityState>(knownEvents);
    this.persistedState = initialState;
  }

  pushEvents = (...events: IEvent[]): EventEntity<IEntityState> => {
    this.pendingEvents = this.pendingEvents.concat(events);
    return this;
  };

  confirmEvents = (): EventEntity<IEntityState> => {
    this.persistedState = this.reducer.reduce(this.persistedState, this.pendingEvents);
    this.lastPersistedEventId = this.pendingEvents[this.pendingEvents.length - 1].id;
    this.pendingEvents = [];
    return this;
  };

  get currentState(): IEntityState {
    return this.reducer.reduce(this.persistedState, this.pendingEvents);
  }
}
