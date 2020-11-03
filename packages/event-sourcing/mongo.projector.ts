import {MongoClient, MongoClientOptions} from 'mongodb'
import {inject, injectable, postConstruct} from 'inversify'
import {EachMessagePayload} from 'kafkajs'
import {from} from 'rxjs'
import {concatMap} from 'rxjs/operators'

import {EventListener} from '@centsideas/messaging'

import {PersistedESEvent} from './persisted-es-event'
import {Projector} from './projector'

interface SequenceCounter {
  name: string
  sequence: number
}

@injectable()
export abstract class MongoProjector extends Projector {
  abstract topic: string
  abstract consumerGroup: string
  abstract sequenceCounterName: string
  abstract async getEvents(from: number): Promise<PersistedESEvent[]>
  abstract databaseUrl: string
  abstract databaseName: string
  abstract databaseAuth?: {user: string; password: string}

  private client!: MongoClient
  private readonly sequenceCollectionName = 'counters'

  @inject(EventListener) private eventListener!: EventListener

  @postConstruct()
  async init() {
    const options: MongoClientOptions = {
      w: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: this.databaseAuth?.user === 'testing' ? undefined : this.databaseAuth,
    }
    this.client = new MongoClient(`mongodb://${this.databaseUrl}`, options)
    await this.client.connect()

    await this.initializeSequenceCounter()
    await this.replay()

    const listener = await this.eventListener.consume(this.consumerGroup, this.topic)
    listener
      .pipe(
        concatMap(({message}: EachMessagePayload) => {
          const object = JSON.parse(message.value?.toString() || '{}')
          const event = PersistedESEvent.fromObject(object)
          return from(this.trigger(event))
        }),
      )
      .subscribe()
  }

  async getBookmark() {
    const collection = await this.counterCollection()
    const counter = await collection.findOne({name: this.sequenceCounterName})
    return counter?.sequence || 0
  }

  async increaseBookmark() {
    const collection = await this.counterCollection()
    await collection.findOneAndUpdate({name: this.sequenceCounterName}, {$inc: {sequence: 1}})
  }

  async shutdown() {
    await this.eventListener.disconnectAll()
  }

  isHealthy() {
    return this.eventListener.isConnected() && this.client.isConnected()
  }

  private async counterCollection() {
    const db = await this.db()
    return db.collection<SequenceCounter>(this.sequenceCollectionName)
  }

  private async initializeSequenceCounter() {
    const collection = await this.counterCollection()
    const existing = await collection.findOne({name: this.sequenceCounterName})
    if (!existing) await collection.insertOne({name: this.sequenceCounterName, sequence: 0})
  }

  protected async db() {
    if (!this.client.isConnected()) await this.client.connect()
    return this.client.db(this.databaseName)
  }
}
