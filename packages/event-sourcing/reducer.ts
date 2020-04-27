import { IEvent } from '@centsideas/models';

import { IEventCommitFunctions } from './event-entity';

export class Reducer<IEntityState> {
  constructor(private knownEvents: IEventCommitFunctions<IEntityState>) {}

  reduce = (currentState: IEntityState, events: IEvent[]): IEntityState => {
    let currentEventNumber: number = (currentState as any).lastEventNumber || 0;

    return events.reduce<IEntityState>((state: IEntityState, event: IEvent) => {
      const commitFunction = this.knownEvents[event.name];
      currentEventNumber += 1;
      return commitFunction(
        { ...state, lastEventId: event.id, lastEventNumber: currentEventNumber },
        event,
      );
    }, currentState);
  };
}
