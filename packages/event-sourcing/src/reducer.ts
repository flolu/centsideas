import { IEvent } from './event';

export class Reducer<IEntityState> {
  constructor(private knownEvents: any) {}

  reduce = (state: IEntityState, events: IEvent[]): IEntityState => {
    return events.reduce<IEntityState>((state: IEntityState, event: IEvent) => {
      const eventHandler = this.knownEvents[event.name];
      return eventHandler({ ...state, lastEventId: event.id }, event);
    }, state);
  };
}
