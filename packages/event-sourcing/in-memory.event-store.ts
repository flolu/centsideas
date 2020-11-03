import {id, injectable} from 'inversify'

import {Id} from '@centsideas/common/types'
import {EventDispatcher} from '@centsideas/messaging'

import {EventStore} from './event-store'
import {PersistedESEvent} from './persisted-es-event'
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue'
import {Aggregate} from './aggregate'
import {Snapshot} from './snapshot'

@injectable()
export class InMemoryEventStore<TAggregateClass extends Aggregate<any>>
  implements EventStore<TAggregateClass> {
  private readonly topicPrefix = 'event-sourcing'
  private events: PersistedESEvent[] = []
  private snapshots = new Map<string, Snapshot>()
  private sequence = 0
  private defaultSnapshotThreshold: number | undefined

  constructor(private eventDispatcher: EventDispatcher) {}

  setDefaultSnapshotThreshold(threshold: number) {
    this.defaultSnapshotThreshold = threshold
  }

  async store(aggregate: TAggregateClass, snapshotThreshold?: number) {
    const events = aggregate.flushEvents()
    if (!events.toArray().length) return

    const lastEvent = this.getLastEvent(events.aggregateId)
    if (lastEvent && lastEvent.event.version !== aggregate.persistedVersion)
      throw new OptimisticConcurrencyIssue(lastEvent.id.toString(), aggregate.persistedVersion)

    const toInsert = events.toArray().map(event => {
      this.sequence++
      return new PersistedESEvent(event.aggregateId, this.sequence, event)
    })

    toInsert.forEach(e => this.events.push(e))
    const topic = `${this.topicPrefix}.${toInsert[0].event.name.aggregate}`
    await this.eventDispatcher.dispatch(
      topic,
      toInsert.map(event => ({
        key: event.event.aggregateId.toString(),
        value: JSON.stringify(event.serialize()),
      })),
    )

    const threshold = snapshotThreshold ? snapshotThreshold : this.defaultSnapshotThreshold
    if (threshold) {
      const snapshot = await this.getSnapshot(aggregate.aggregateId)
      const lastSnapshotVersion = snapshot?.version || 0
      const lastEventVersion = aggregate.persistedVersion + toInsert.length
      if (lastEventVersion - lastSnapshotVersion >= threshold) await this.storeSnapshot(aggregate)
    }
  }

  async getStream(aggregateId: Id, fromVersion?: number) {
    return this.events
      .filter(({event}) => aggregateId.equals(event.aggregateId))
      .filter(({event}) => (fromVersion ? fromVersion <= event.version : true))
      .sort((a, b) => a.event.version - b.event.version)
  }

  async getEvents(fromSequence?: number) {
    return this.events
      .filter(e => (fromSequence ? fromSequence <= e.sequence : true))
      .sort((a, b) => a.sequence - b.sequence)
  }

  async deleteStream(aggregateId: Id) {
    this.events = this.events.filter(({event}) => !aggregateId.equals(event.aggregateId))
  }

  async storeSnapshot(aggregate: TAggregateClass) {
    this.snapshots.set(aggregate.aggregateId.toString(), aggregate.snapshot)
  }

  async getSnapshot(aggregateId: Id) {
    return this.snapshots.get(aggregateId.toString())
  }

  async loadAggregate(aggregateId: Id, AggregateClass: any, ...additionalParams: any[]) {
    const snapshot = await this.getSnapshot(aggregateId)
    const events = snapshot
      ? await this.getStream(aggregateId, snapshot.version + 1)
      : await this.getStream(aggregateId)

    if (!(AggregateClass.prototype instanceof Aggregate))
      throw new Error('Class does not extend Aggregate.')
    return AggregateClass.buildFrom(
      events.map(e => e.event),
      snapshot,
      ...additionalParams,
    ) as TAggregateClass
  }

  private getLastEvent(aggregateId: Id): PersistedESEvent | undefined {
    return this.events
      .filter(({event}) => event.aggregateId.equals(aggregateId))
      .sort((a, b) => b.event.version - a.event.version)[0]
  }
}
