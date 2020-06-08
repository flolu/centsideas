import {PersistedEvent} from '@centsideas/models';

export interface GetEvents {
  after: number;
}

export type GetEventsCommand = (payload: GetEvents) => Promise<{events: PersistedEvent[]}>;
