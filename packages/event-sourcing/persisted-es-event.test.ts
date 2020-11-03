import {Id, Timestamp} from '@centsideas/common/types'

import {ESEvent} from './es-event'
import {EventName} from './event-name'
import {PersistedESEvent, SerializedPersistedESEvent} from './persisted-es-event'

interface Payload {
  message: string
  count: number
}

describe('persisted event sourcing event', () => {
  const id = Id.generate()
  const aggregateId = Id.generate()
  const eventName = EventName.fromString('example:happened')
  const timestamp = Timestamp.now()
  const payload = {message: 'hello', count: 42}
  const version = 1
  const sequence = 10

  const serialized: SerializedPersistedESEvent<Payload> = {
    id: id.toString(),
    sequence,
    name: eventName.toString(),
    aggregateId: aggregateId.toString(),
    payload,
    version,
    timestamp: timestamp.toString(),
  }
  const event = ESEvent.fromObject(serialized)

  it('can be created from serialized object', () => {
    const persistedEvent = PersistedESEvent.fromObject(serialized)
    expect(persistedEvent.id).toEqual(id)
    expect(persistedEvent.sequence).toEqual(sequence)
    expect(persistedEvent.event).toEqual(event)
  })

  it('can be serialzied', () => {
    const persistedEvent = new PersistedESEvent(id, sequence, event)
    expect(persistedEvent.serialize()).toEqual(serialized)
  })
})
