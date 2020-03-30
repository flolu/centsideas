import { IEvent } from './event';

export class Reducer<IEntityState> {
  constructor(private knownEvents: any) {}

  reduce = (state: IEntityState, events: IEvent[]): IEntityState => {
    return events.reduce<IEntityState>((s: IEntityState, event: IEvent) => {
      const eventHandler = this.knownEvents[event.name];
      return eventHandler({ ...s, lastEventId: event.id }, event);
    }, state);
  };
}
