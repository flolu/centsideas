// TODO import persisted event from models
import {PersistedEvent} from '@centsideas/event-sourcing2';

export interface IdeaEventStore {
  getEvents: (payload: {from: number}) => Promise<{events: PersistedEvent[]}>;
}
