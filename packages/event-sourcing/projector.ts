import * as retry from 'async-retry'

import {PersistedESEvent} from './persisted-es-event'

export abstract class Projector {
  abstract getBookmark(): Promise<number>
  abstract increaseBookmark(): Promise<void>
  abstract getEvents(from: number): Promise<PersistedESEvent[]>
  abstract shutdown(): Promise<void>
  abstract handleEvent(event: PersistedESEvent): Promise<void>

  async trigger(event: PersistedESEvent) {
    const bookmark = await this.getBookmark()
    if (event.sequence !== bookmark + 1) return false

    await this.handleEvent(event)
    await this.increaseBookmark()
    return true
  }

  async replay() {
    const bookmark = await this.getBookmark()
    const events = await retry(() => this.getEvents(bookmark + 1))
    for (const event of events) {
      await this.trigger(event)
    }
  }
}
