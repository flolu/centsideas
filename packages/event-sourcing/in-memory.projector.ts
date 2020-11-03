import {inject, injectable, postConstruct} from 'inversify'
import {concatMap} from 'rxjs/operators'
import {from} from 'rxjs'
import {EachMessagePayload} from 'kafkajs'

import {EventListener} from '@centsideas/messaging'

import {PersistedESEvent} from './persisted-es-event'
import {Projector} from './projector'

@injectable()
export abstract class InMemoryProjector extends Projector {
  abstract topic: string
  abstract consumerGroup: string
  abstract async getEvents(from: number): Promise<PersistedESEvent[]>

  @inject(EventListener) private eventListener!: EventListener

  private currentBookmark = 0

  @postConstruct()
  async init() {
    // this.replay()
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
    return this.currentBookmark
  }

  async increaseBookmark() {
    this.currentBookmark += 1
  }

  async shutdown() {
    await this.eventListener.disconnectAll()
  }
}
