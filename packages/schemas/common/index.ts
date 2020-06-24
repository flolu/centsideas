import {PersistedEvent} from '@centsideas/models';

export interface GetEvents {
  after: number;
  streamId?: string;
}

export type GetEventsCommand = (payload: GetEvents) => Promise<{events: PersistedEvent[]}>;
