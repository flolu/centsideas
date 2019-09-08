import { IEvent } from './event';

// FIXME better name for interface
export interface KnownEvents<Entity> {
  [name: string]: ICommitFunction<Entity, any>;
}

export class Reducer<Entity> {
  constructor(private knownEvents: KnownEvents<Entity>) {}

  reduce = (state: Entity, events: IEvent<any>[]): Entity => {
    return events.reduce<Entity>((state: Entity, event: IEvent<any>) => {
      return this.knownEvents[event.name]({ ...state }, event);
    }, state);
  };
}

export interface ICommitFunction<Entity, Event> {
  (state: Entity, event: Event): Entity;
}
