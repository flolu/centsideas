import {Id, Timestamp} from '@centsideas/common/types'

import {StreamEvents, WrongChronologicalOrdering, InconsistentAggregateType} from './stream-events'
import {BankEventNames, BankAccountOpened, MoneyDeposited} from './testing'
import {EventName} from './event-name'
import {ESEvent} from './es-event'

describe('event stream', () => {
  const id = Id.generate()

  it('creates empty stream', () => {
    const stream1 = StreamEvents.empty(id)
    expect(stream1.toArray()).toEqual([])
    const startVersion = 42
    const stream2 = StreamEvents.empty(id, startVersion)
    expect(stream2.toArray()).toEqual([])
    expect(stream2.version).toEqual(startVersion)
  })

  it('adds events', () => {
    const stream = StreamEvents.empty(id)
    const timestamp = Timestamp.now()
    const name = EventName.fromString(BankEventNames.Opened)
    const payload = new BankAccountOpened(id.toString())
    stream.add(name, payload, timestamp)

    expect(stream.toArray()).toEqual([new ESEvent(name, id, payload, 1, timestamp)])
  })

  it('increases version', () => {
    const stream = StreamEvents.empty(id)
    const timestamp = Timestamp.now()
    const name = EventName.fromString(BankEventNames.Opened)
    const payload = undefined
    stream.increaseVersion()
    stream.add(name, payload, timestamp)

    expect(stream.toArray()).toEqual([new ESEvent(name, id, payload, 2, timestamp)])
  })

  it('converts to array of payloads', () => {
    const stream = StreamEvents.empty(id)
    const timestamp = Timestamp.now()
    const name1 = EventName.fromString(BankEventNames.Opened)
    const payload1 = new BankAccountOpened(id.toString())
    stream.add(name1, payload1, timestamp)
    const name2 = EventName.fromString(BankEventNames.Deposited)
    const payload2 = new MoneyDeposited(100)
    stream.add(name2, payload2, timestamp)

    expect(stream.toPayloads()).toEqual([payload1, payload2])
  })

  it('recognizes wrong chronological ordering', () => {
    const stream = StreamEvents.empty(id)
    const timestamp1 = Timestamp.fromString('2000-08-31T16:47+00:00')
    const timestamp2 = Timestamp.fromString('2007-08-31T16:47+00:00')

    const name1 = EventName.fromString(BankEventNames.Opened)
    const payload1 = new BankAccountOpened(id.toString())
    stream.add(name1, payload1, timestamp2)
    const name2 = EventName.fromString(BankEventNames.Deposited)
    const payload2 = new MoneyDeposited(100)
    expect(() => stream.add(name2, payload2, timestamp1)).toThrow(
      new WrongChronologicalOrdering(name1.name, id.toString(), 2),
    )
  })

  it('recognizes inconsistent aggregate types', () => {
    const stream = StreamEvents.empty(id)
    const timestamp = Timestamp.now()
    const name1 = EventName.fromString(BankEventNames.Opened)
    const payload1 = new BankAccountOpened(id.toString())
    stream.add(name1, payload1, timestamp)
    const name2 = EventName.fromString('wrongName:deposited')
    const payload2 = new MoneyDeposited(100)
    expect(() => stream.add(name2, payload2, timestamp)).toThrow(
      new InconsistentAggregateType(
        name2.aggregate,
        name1.aggregate,
        id.toString(),
        name2.toString(),
      ),
    )
  })
})
