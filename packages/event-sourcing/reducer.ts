import { IEvent } from './event';
import { IEventCommitFunctions } from './event-entity';

export class Reducer<IEntityState> {
  constructor(private knownEvents: IEventCommitFunctions<IEntityState>) {}

  reduce = (currentState: IEntityState, events: IEvent[]): IEntityState => {
    return events.reduce<IEntityState>((state: IEntityState, event: IEvent) => {
      const commitFunction = this.knownEvents[event.name];
      return commitFunction(
        { ...state, lastEventId: event.id, lastEventNumber: event.eventNumber },
        event,
      );
    }, currentState);
  };
}
