import {Id} from '@centsideas/common/types'

import {ESEvent} from './es-event'
import {PersistedESEvent} from './persisted-es-event'
import {EventName} from './event-name'
import {Projector} from './projector'

describe('projector', () => {
  const aggregateId = Id.generate()
  const eventId1 = Id.generate()
  const sampleEvent1 = new PersistedESEvent(
    eventId1,
    1,
    new ESEvent(EventName.fromString('test:sample'), aggregateId, {}, 1),
  )

  class SampleProjector extends Projector {
    private bookmark = 0

    async getBookmark() {
      return this.bookmark
    }
    async increaseBookmark() {
      this.bookmark += 1
    }
    async getEvents() {
      return [sampleEvent1]
    }
    async shutdown() {
      //
    }
    async handleEvent(event: PersistedESEvent) {
      //
    }
  }

  it('replays events', async () => {
    const projector = new SampleProjector()
    spyOn(projector, 'trigger').and.callThrough()
    await projector.replay()
    expect(projector.trigger).toHaveBeenCalledWith(sampleEvent1)
    const bookmark = await projector.getBookmark()
    expect(bookmark).toEqual(1)
  })

  it('triggers event handler', async () => {
    const projector = new SampleProjector()
    spyOn(projector, 'handleEvent').and.callThrough()
    spyOn(projector, 'increaseBookmark').and.callThrough()
    const result = await projector.trigger(sampleEvent1)
    expect(result).toEqual(true)
    expect(projector.handleEvent).toHaveBeenCalledWith(sampleEvent1)
    expect(projector.increaseBookmark).toHaveBeenCalledTimes(1)
    const bookmark = await projector.getBookmark()
    expect(bookmark).toEqual(1)
  })

  it('prevents from triggering events out of order', async () => {
    const projector = new SampleProjector()
    spyOn(projector, 'handleEvent').and.callThrough()
    spyOn(projector, 'increaseBookmark').and.callThrough()

    const wrongEvent = new PersistedESEvent(
      eventId1,
      3,
      new ESEvent(EventName.fromString('test:sample'), aggregateId, {}, 1),
    )
    const result = await projector.trigger(wrongEvent)
    expect(result).toEqual(false)
    expect(projector.handleEvent).not.toHaveBeenCalled()
    expect(projector.increaseBookmark).toHaveBeenCalledTimes(0)
    expect(await projector.getBookmark()).toEqual(0)
  })
})
