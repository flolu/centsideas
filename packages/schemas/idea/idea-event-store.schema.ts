import {PersistedEvent} from '@centsideas/models';

export interface IdeaEventStore {
  getEvents: (payload: {from: number}) => Promise<{events: PersistedEvent[]}>;
}
