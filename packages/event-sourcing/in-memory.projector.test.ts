import 'reflect-metadata'

import {Container, injectable} from 'inversify'

import {
  EventDispatcherMock,
  EventListener,
  EventListenerMock,
  MockEmitter,
} from '@centsideas/messaging'
import {Id, Timestamp} from '@centsideas/common/types'

import {InMemoryProjector} from './in-memory.projector'
import {ESEvent} from './es-event'
import {PersistedESEvent} from './persisted-es-event'
import {EventName} from './event-name'

describe('in memory projector', () => {
  const topic = Timestamp.now().toString()

  @injectable()
  class SampleProjector extends InMemoryProjector {
    topic = topic
    consumerGroup = ''

    async getEvents(from: number) {
      return []
    }
    async handleEvent(_event: PersistedESEvent) {
      //
    }
  }

  const container = new Container({skipBaseClassChecks: true})
  container.bind(InMemoryProjector).toSelf()
  container.bind(EventListener).to(EventListenerMock as any)
  container.bind(EventDispatcherMock).toSelf()
  container.bind(SampleProjector).toSelf().inSingletonScope()
  container.bind(MockEmitter).toSelf().inSingletonScope()

  const aggregateId = Id.generate()
  const eventId1 = Id.generate()
  const sampleEvent = new PersistedESEvent(
    eventId1,
    1,
    new ESEvent(EventName.fromString('test:sample'), aggregateId, {}, 1),
  )
  const projector = container.get(SampleProjector)
  const dispatcher = container.get(EventDispatcherMock)

  it('triggers events and updates bookmark', async () => {
    spyOn(projector, 'trigger').and.callThrough()
    await dispatcher.dispatch(topic, [
      {
        key: sampleEvent.event.aggregateId.toString(),
        value: JSON.stringify(sampleEvent.serialize()),
      },
    ])

    expect(projector.trigger).toHaveBeenCalledWith(sampleEvent)
  })

  afterAll(async () => {
    await projector.shutdown()
  })
})
