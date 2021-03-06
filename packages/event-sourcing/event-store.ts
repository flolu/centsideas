import {PersistedEvent} from '@centsideas/models';

import {StreamEvents} from './stream-event';

export interface EventStore {
  getStream(id: string, after?: number): Promise<PersistedEvent[]>;
  getEvents(after: number): Promise<PersistedEvent[]>;
  store(events: StreamEvents, lastVersion: number): Promise<void>;
}
