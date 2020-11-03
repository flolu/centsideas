import {inject, injectable, interfaces} from 'inversify'
import {MongoClient, MongoClientOptions} from 'mongodb'

import {Id} from '@centsideas/common/types'
import {EventDispatcher} from '@centsideas/messaging'

import {EventStore} from './event-store'
import {PersistedESEvent, SerializedPersistedESEvent} from './persisted-es-event'
import {Aggregate} from './aggregate'
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue'
import {InMemoryEventStore} from './in-memory.event-store'
import {SerializedSnapshot, Snapshot} from './snapshot'

@injectable()
export class MongoEventStore<TAggregateClass extends Aggregate<any>>
  implements EventStore<TAggregateClass> {
  private readonly topicPrefix = 'event-sourcing'
  private readonly eventsCollectionName = 'events'
  private readonly snapshotsCollectionName = 'snapshots'
  private databaseName!: string
  private client!: MongoClient
  private defaultSnapshotThreshold: number | undefined

  @inject(EventDispatcher) private eventDispatcher!: EventDispatcher

  configure(url: string, name: string, auth?: {user: string; password: string}) {
    this.databaseName = name
    const options: MongoClientOptions = {
      w: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth,
    }
    this.client = new MongoClient(`mongodb://${url}`, options)
    this.client.connect()
    this.setupIndexes()
  }

  setDefaultSnapshotThreshold(threshold: number) {
    this.defaultSnapshotThreshold = threshold
  }

  async store(aggregate: TAggregateClass, snapshotThreshold?: number) {
    const events = aggregate.flushEvents()
    if (!events.toArray().length) return

    const lastEvent = await this.getLastEventOfStream(events.aggregateId)
    if (lastEvent && lastEvent.event.version !== aggregate.persistedVersion)
      throw new OptimisticConcurrencyIssue(lastEvent.id.toString(), aggregate.persistedVersion)

    let currentSequence = await this.getLastSequence()
    const toInsert = events.toArray().map(event => {
      currentSequence += 1
      return new PersistedESEvent(Id.generate(), currentSequence, event)
    })

    const collection = await this.eventsCollection()
    const inserted = await collection.insertMany(toInsert.map(e => e.serialize()))

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
      const lastEventVersion = aggregate.persistedVersion + inserted.insertedCount
      if (lastEventVersion - lastSnapshotVersion >= threshold) await this.storeSnapshot(aggregate)
    }
  }

  async getStream(aggregateId: Id, from?: number) {
    const collection = await this.eventsCollection()
    const result = await collection.find({
      aggregateId: aggregateId.toString(),
      version: {$gte: from ? from : 0},
    })
    return (await result.toArray()).map(e => PersistedESEvent.fromObject(e))
  }

  async getEvents(from?: number) {
    const collection = await this.eventsCollection()
    const result = await collection.find(from ? {sequence: {$gte: from}} : {}, {
      sort: {sequence: 1},
    })
    return (await result.toArray()).map(e => PersistedESEvent.fromObject(e))
  }

  async deleteStream(aggregateId: Id) {
    const collection = await this.eventsCollection()
    await collection.deleteMany({aggregateId: aggregateId.toString()})
  }

  async disconnect() {
    await this.client.close()
  }

  isHealthy() {
    return this.client.isConnected() && this.eventDispatcher.isConnected()
  }

  async storeSnapshot(aggregate: TAggregateClass) {
    const id = aggregate.aggregateId
    const collection = await this.snapshotsCollection()
    await collection.findOneAndUpdate(
      {aggregateId: id.toString()},
      {$set: aggregate.snapshot.serialize()},
      {upsert: true},
    )
  }

  async getSnapshot(aggregateId: Id) {
    const collection = await this.snapshotsCollection()
    const found = await collection.findOne({aggregateId: aggregateId.toString()})
    if (!found) return undefined
    return Snapshot.fromObject(found)
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

  private async getLastSequence() {
    const collection = await this.eventsCollection()
    const result = await collection.find({}, {sort: {sequence: -1}, limit: 1})
    const events = await result.toArray()
    if (!events.length) return 0
    return events[0].sequence
  }

  private async getLastEventOfStream(aggregateId: Id) {
    const collection = await this.eventsCollection()
    const result = await collection.find(
      {aggregateId: aggregateId.toString()},
      {sort: {version: -1}, limit: 1},
    )
    const lastEvent = (await result.toArray())[0]
    return lastEvent ? PersistedESEvent.fromObject(lastEvent) : undefined
  }

  private async eventsCollection() {
    const db = await this.db()
    return db.collection<SerializedPersistedESEvent>(this.eventsCollectionName)
  }

  private async snapshotsCollection() {
    const db = await this.db()
    return db.collection<SerializedSnapshot>(this.snapshotsCollectionName)
  }

  private async db() {
    if (!this.client.isConnected()) await this.client.connect()
    return this.client.db(this.databaseName)
  }

  private async setupIndexes() {
    const events = await this.eventsCollection()
    const snapshots = await this.snapshotsCollection()
    await events.createIndexes([
      {key: {aggregateId: 1}, name: 'aggregateId'},
      {key: {aggregateId: 1, version: 1}, name: 'aggregateId_version', unique: true},
      {key: {sequence: 1}, name: 'sequence', unique: true},
    ])
    await snapshots.createIndexes([{key: {aggregateId: 1}, name: 'aggregateId', unique: true}])
  }
}

export type MongoEventStoreFactory = (
  url: string,
  name: string,
  auth?: {user: string; password: string},
) => MongoEventStore<any>
export const mongoEventStoreFactory = (context: interfaces.Context) => {
  return (url: string, name: string, auth?: {user: string; password: string}) => {
    const eventStore = context.container.get(MongoEventStore)
    eventStore.configure(url, name, auth)
    return eventStore
  }
}

export type MongoEventStoreFactoryMock = (
  url: string,
  name: string,
  auth?: {user: string; password: string},
) => MongoEventStore<any>
export const mongoEventStoreFactoryMock = (context: interfaces.Context) => {
  return (_url: string, _name: string, _auth?: {user: string; password: string}) => {
    const eventStore = context.container.get(InMemoryEventStore)
    return eventStore
  }
}
