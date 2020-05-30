import {Id} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';

import {StreamEvents} from './stream-event';

export interface EventStore {
  getStream(id: Id): Promise<PersistedEvent[]>;
  getEvents(from: number): Promise<PersistedEvent[]>;
  store(events: StreamEvents, lastVersion: number): Promise<void>;
}
