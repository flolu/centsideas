import {Container} from 'inversify'

import {Id} from '@centsideas/common/types'
import {expectAsyncError} from '@centsideas/testing'
import {EventDispatcher, EventDispatcherMock, MockEmitter} from '@centsideas/messaging'

import {generateSampleEvents, expectEventsToEqual, BankAccount, BankAccountState} from './testing'
import {InMemoryEventStore} from './in-memory.event-store'
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue'
import {Snapshot} from './snapshot'

describe('in memory event store', () => {
  const id1 = Id.generate()
  const id2 = Id.generate()

  const container = new Container({skipBaseClassChecks: true})
  container.bind(InMemoryEventStore).toSelf()
  container.bind(EventDispatcher).to(EventDispatcherMock as any)
  container.bind(MockEmitter).toSelf()

  const eventStore = container.get(InMemoryEventStore)
  const snapshotThreshold = 3
  eventStore.setDefaultSnapshotThreshold(snapshotThreshold)

  it('stores and retrieves events', async () => {
    const sample1 = generateSampleEvents(id1)
    await eventStore.store(sample1.equivalentAccount)
    const events1 = await eventStore.getStream(id1)

    const snapshot1: Snapshot<BankAccountState> | undefined = await eventStore.getSnapshot(id1)
    const serialized1 = snapshot1!.serialize()
    expect(serialized1.state.closedAt).toBeDefined()
    delete serialized1.state.lastTransactionAt
    delete serialized1.state.closedAt
    expect(serialized1).toEqual({
      aggregateId: id1.toString(),
      version: sample1.events.length,
      state: {
        id: id1.toString(),
        balance: 150,
        transactions: 2,
      },
    })

    expectEventsToEqual(
      events1.map(e => e.event),
      sample1.events,
    )
    events1.forEach((event, index) => expect(event.sequence).toEqual(index + 1))

    const events2 = await eventStore.getEvents()
    expectEventsToEqual(
      events2.map(e => e.event),
      sample1.events,
    )
    events2.forEach((event, index) => expect(event.sequence).toEqual(index + 1))

    const sample2 = generateSampleEvents(id2)
    await eventStore.store(sample2.equivalentAccount)

    const events3 = await eventStore.getStream(id2)
    const lastSequence = sample1.events.length
    expectEventsToEqual(
      events3.map(e => e.event),
      sample2.events,
    )
    events3.forEach((event, index) => expect(event.sequence).toEqual(lastSequence + index + 1))

    const events4 = await eventStore.getEvents()
    expectEventsToEqual(
      events4.map(e => e.event),
      [...sample1.events, ...sample2.events],
    )
    events4.forEach((event, index) => expect(event.sequence).toEqual(index + 1))

    const from1 = 4
    const events5 = await eventStore.getStream(id1, from1)
    expectEventsToEqual(
      events5.map(e => e.event),
      sample1.events.slice(3),
    )

    const from2 = 3
    const events6 = await eventStore.getEvents(from2)
    expectEventsToEqual(
      events6.map(e => e.event),
      [...sample1.events, ...sample2.events].slice(from2 - 1),
    )
  })

  it('recognizes optimistic concurrency issue', async () => {
    const id = Id.generate()
    const account1 = BankAccount.open(id, 1000)
    await eventStore.store(account1)
    const events = await eventStore.getStream(id)
    const account2 = BankAccount.buildFrom(events.map(e => e.event))
    const account3 = BankAccount.buildFrom(events.map(e => e.event))
    account2.withdraw(100)
    account3.withdraw(999)
    await eventStore.store(account3)

    await expectAsyncError(
      () => eventStore.store(account2),
      new OptimisticConcurrencyIssue(events[0].id.toString(), account3.persistedVersion),
    )
  })

  it('stores and retrieves snapshots', async () => {
    const events = await eventStore.getStream(id1)
    const account1 = BankAccount.buildFrom(events.map(e => e.event))

    await eventStore.storeSnapshot(account1)
    const snapshot = await eventStore.getSnapshot(id1)
    const account2 = BankAccount.buildFrom([], snapshot)

    expect(account1.currentState).toEqual(account2.currentState)
  })

  it('loads aggregates', async () => {
    const account1 = await eventStore.loadAggregate(id1, BankAccount)
    const events = await eventStore.getStream(id1)
    const account2 = BankAccount.buildFrom(events.map(e => e.event))
    const account1Obj = Object(account1)
    const account2Obj = Object(account2)
    delete account1Obj.events.startVersion
    delete account2Obj.events.startVersion
    expect(account1Obj).toEqual(account2Obj)
  })

  it('deletes streams', async () => {
    const stream1 = await eventStore.getStream(id1)
    expect(stream1.length).toBeGreaterThan(0)
    await eventStore.deleteStream(id1)
    const stream2 = await eventStore.getStream(id1)
    expect(stream2.length).toEqual(0)
  })
})
