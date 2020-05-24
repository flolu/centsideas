import {Id} from '@centsideas/types';

import {StreamEvents} from './stream-event';
import {PersistedEvent} from './persisted-event';

/**
 * TODO snapshots (but probably not into event store)
 * https://eventstore.com/docs/event-sourcing-basics/rolling-snapshots/index.html
 */
export interface EventStore {
  getStream(id: Id): Promise<PersistedEvent[]>;
  getEvents(from: number): Promise<PersistedEvent[]>;
  store(events: StreamEvents, lastVersion: number): Promise<void>;
}
