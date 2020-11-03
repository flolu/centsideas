import {Id} from '@centsideas/common/types'

import {PersistedESEvent} from './persisted-es-event'
import {Snapshot} from './snapshot'

export interface EventStore<TAggregateClass> {
  store(aggregate: TAggregateClass, snapshotThreshold?: number): Promise<void>
  // TODO what happens / should happen if stream does not exist?
  getStream(aggregateId: Id, from?: number): Promise<PersistedESEvent[]>
  getEvents(from: number): Promise<PersistedESEvent[]>
  deleteStream(aggregateId: Id): Promise<void>

  setDefaultSnapshotThreshold(threshold: number): void
  storeSnapshot(aggregate: TAggregateClass): Promise<void>
  getSnapshot(aggregateId: Id): Promise<Snapshot | undefined>

  loadAggregate(
    aggregateId: Id,
    Aggregate: any,
    ...additionalParams: any[]
  ): Promise<TAggregateClass>
}
