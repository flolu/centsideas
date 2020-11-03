import {Id, Timestamp} from '@centsideas/common/types'

import {ESEvent, SerializedESEvent} from './es-event'
import {EventName} from './event-name'

interface Payload {
  message: string
  count: number
}

describe('event sourcing event', () => {
  const aggregateId = Id.generate()
  const eventName = EventName.fromString('example:happened')
  const timestamp = Timestamp.now()
  const payload = {message: 'hello', count: 42}
  const version = 1

  const serialized: SerializedESEvent<Payload> = {
    name: eventName.toString(),
    aggregateId: aggregateId.toString(),
    payload,
    version,
    timestamp: timestamp.toString(),
  }

  it('can be created from serialized object', () => {
    const event = ESEvent.fromObject(serialized)
    expect(event.name).toEqual(eventName)
    expect(event.aggregateId).toEqual(aggregateId)
    expect(event.payload).toEqual(payload)
    expect(event.timestamp).toEqual(timestamp)
  })

  it('can be serialzied', () => {
    const event = new ESEvent(eventName, aggregateId, payload, version, timestamp)
    expect(event.serialize()).toEqual(serialized)
  })
})
