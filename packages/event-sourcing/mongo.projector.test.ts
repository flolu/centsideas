import 'reflect-metadata'
import {Container, injectable} from 'inversify'
import {MongoMemoryServer} from 'mongodb-memory-server'

import {Id, Timestamp} from '@centsideas/common/types'
import {
  EventListener,
  EventListenerMock,
  EventDispatcherMock,
  MockEmitter,
} from '@centsideas/messaging'

import {MongoProjector} from './mongo.projector'
import {PersistedESEvent} from './persisted-es-event'
import {EventName} from './event-name'
import {ESEvent} from './es-event'

describe('mongo projector', () => {
  it('triggers events and updates bookmark', async () => {
    const topic = Timestamp.now().toString()
    const container = new Container({skipBaseClassChecks: true})
    const mongod = new MongoMemoryServer()
    const uri = await mongod.getUri()
    const dbName = await mongod.getDbName()

    @injectable()
    class SampleProjector extends MongoProjector {
      topic = topic
      consumerGroup = 'test-group'
      databaseName = dbName
      databaseUrl = uri.replace('mongodb://', '')
      databaseAuth = undefined
      sequenceCounterName = 'testCounter'

      async getEvents(_from: number) {
        return []
      }
      async handleEvent(_event: PersistedESEvent) {
        //
      }
    }

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

    await new Promise(res => setTimeout(() => res(), 100))

    spyOn(projector, 'trigger').and.callThrough()
    spyOn(projector, 'handleEvent').and.callThrough()
    spyOn(projector, 'increaseBookmark').and.callThrough()

    const dispatcher = container.get(EventDispatcherMock)
    await dispatcher.dispatch(topic, [
      {
        key: sampleEvent.event.aggregateId.toString(),
        value: JSON.stringify(sampleEvent.serialize()),
      },
    ])

    await new Promise(res => setTimeout(() => res(), 100))

    expect(projector.trigger).toHaveBeenCalledWith(sampleEvent)
    expect(projector.increaseBookmark).toHaveBeenCalled()
    expect(projector.handleEvent).toHaveBeenCalledWith(sampleEvent)
    expect(await projector.getBookmark()).toEqual(1)

    await projector.shutdown()
    await mongod.stop()
  })
})
