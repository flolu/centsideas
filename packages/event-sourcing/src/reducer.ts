import { IEvent } from './event';

export class Reducer<IEntityState> {
  constructor(private knownEvents: any) {}

  reduce = (state: IEntityState, events: IEvent[]): IEntityState => {
    return events.reduce<IEntityState>((state: IEntityState, event: IEvent) => {
      return this.knownEvents[event.name]({ ...state }, event);
    }, state);
  };
}
