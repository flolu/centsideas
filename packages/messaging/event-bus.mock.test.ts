import 'reflect-metadata'

import {Container} from 'inversify'

import {Timestamp} from '@centsideas/common/types'

import {EventDispatcherMock} from './event-dispatcher.mock'
import {EventListenerMock} from './event-listener.mock'
import {MockEmitter} from './mock-emitter'

describe('mock event dispatcher and mock event listener', () => {
  const container = new Container({skipBaseClassChecks: true})
  container.bind(EventDispatcherMock).toSelf().inSingletonScope()
  container.bind(EventListenerMock).toSelf().inSingletonScope()
  container.bind(MockEmitter).toSelf().inSingletonScope()

  const dispatcher = container.get(EventDispatcherMock)

  it('dispatches and listens for events', async () => {
    const listener = container.get(EventListenerMock)
    const payload = 'value a'
    const topic = Timestamp.now().toString()
    const testListener = await listener.consume('', topic)
    let message: any
    testListener.subscribe(data => (message = data.message))
    await dispatcher.dispatch(topic, [{key: 'a', value: payload}])
    expect(message!.value!.toString()).toEqual(payload)
    await listener.disconnectAll()
  })
})
