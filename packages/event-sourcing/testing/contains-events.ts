import {Timestamp} from '@centsideas/common/types'

import {StreamEvents} from '../stream-events'
import {ESEvent} from '..'

export function expectEventsToContain(events: StreamEvents | undefined, event: ESEvent) {
  const fakeTimestamp = Timestamp.now()

  const fakedEvents = events ? events.toArray().map(e => mapEvent(e, fakeTimestamp)) : []
  expect(fakedEvents).toContain(mapEvent(event, fakeTimestamp))
}

function mapEvent(event: ESEvent, fakeTimestamp: Timestamp) {
  return new ESEvent(event.name, event.aggregateId, event.payload, event.version, fakeTimestamp)
}

export function expectEventsToEqual(events: ESEvent[], containing: ESEvent[]) {
  const fakeTimestamp = Timestamp.now()
  const fakedEvents = events.map(e => mapPersistedEvent(e, fakeTimestamp))
  const fakeContaining = containing.map(e => mapPersistedEvent(e, fakeTimestamp))
  expect(fakedEvents).toEqual(fakeContaining)
}

function mapPersistedEvent(event: ESEvent, fakeTimestamp: Timestamp) {
  return new ESEvent(event.name, event.aggregateId, event.payload, event.version, fakeTimestamp)
}
