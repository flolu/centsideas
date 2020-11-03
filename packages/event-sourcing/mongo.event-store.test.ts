import {Container} from 'inversify'
import {MongoMemoryServer} from 'mongodb-memory-server'

import {Id} from '@centsideas/common/types'
import {
  EventDispatcher,
  EventDispatcherMock,
  EventListener,
  EventListenerMock,
  MockEmitter,
} from '@centsideas/messaging'

import {MongoEventStore, MongoEventStoreFactory, mongoEventStoreFactory} from './mongo.event-store'
import {
  BankAccount,
  BankAccountOpened,
  BankEventNames,
  expectEventsToEqual,
  MoneyDeposited,
} from './testing'
import {ESEvent} from './es-event'
import {EventName} from './event-name'
import {classToObject} from './testing/class-to-object'

describe('mongodb event store', () => {
  const container = new Container({skipBaseClassChecks: true})
  container.bind(EventDispatcher).to(EventDispatcherMock as any)
  container.bind(MockEmitter).toSelf().inSingletonScope()
  container.bind(EventListenerMock).toSelf()
  container.bind(EventListener).to(EventListenerMock as any)
  container.bind(MongoEventStore).toSelf()
  container.bind(mongoEventStoreFactory).toFactory(mongoEventStoreFactory)

  let eventStore!: MongoEventStore<BankAccount>
  const snapshotThreshold = 3
  const id1 = Id.generate()
  const id2 = Id.generate()
  const id3 = Id.generate()
  let mongod: MongoMemoryServer

  beforeAll(async () => {
    mongod = new MongoMemoryServer()
    const uri = await mongod.getUri()
    const dbName = await mongod.getDbName()

    const factory: MongoEventStoreFactory = container.get(mongoEventStoreFactory)
    eventStore = factory(uri.replace('mongodb://', ''), dbName)
    eventStore.setDefaultSnapshotThreshold(snapshotThreshold)
  })

  it('stores and retrieves events', async () => {
    const bankAccount1 = BankAccount.open(id1, 100)
    bankAccount1.deposit(50)
    const bankAccount2 = BankAccount.open(id2, 10)

    await eventStore.store(bankAccount1)
    await eventStore.store(bankAccount2)

    const snapshot1 = await eventStore.getSnapshot(id1)
    const serialized1 = snapshot1!.serialize()
    delete serialized1.state.lastTransactionAt
    expect(serialized1).toEqual({
      aggregateId: id1.toString(),
      version: 3,
      state: {
        id: id1.toString(),
        balance: 150,
        transactions: 2,
        closedAt: null,
      },
    })

    const snapshot2 = await eventStore.getSnapshot(id2)
    expect(snapshot2).toBeUndefined()

    const expectedEvents1 = [
      new ESEvent(
        EventName.fromString(BankEventNames.Opened),
        id1,
        classToObject(new BankAccountOpened(id1.toString())),
        1,
      ),
      new ESEvent(
        EventName.fromString(BankEventNames.Deposited),
        id1,
        classToObject(new MoneyDeposited(100)),
        2,
      ),
      new ESEvent(
        EventName.fromString(BankEventNames.Deposited),
        id1,
        classToObject(new MoneyDeposited(50)),
        3,
      ),
    ]
    const expectedEvents2 = [
      new ESEvent(
        EventName.fromString(BankEventNames.Opened),
        id2,
        classToObject(new BankAccountOpened(id2.toString())),
        1,
      ),
      new ESEvent(
        EventName.fromString(BankEventNames.Deposited),
        id2,
        classToObject(new MoneyDeposited(10)),
        2,
      ),
    ]

    const streamEvents1 = await eventStore.getStream(id1)
    streamEvents1.forEach((event, index) => expect(event.sequence).toEqual(index + 1))
    expectEventsToEqual(
      streamEvents1.map(e => e.event),
      expectedEvents1,
    )

    const streamEvents2 = await eventStore.getStream(id2)
    streamEvents2.forEach((event, index) =>
      expect(event.sequence).toEqual(index + streamEvents1.length + 1),
    )
    expectEventsToEqual(
      streamEvents2.map(e => e.event),
      expectedEvents2,
    )

    const streamEventsSliced1 = await eventStore.getStream(id1, 2)
    streamEventsSliced1.forEach((event, index) => expect(event.sequence).toEqual(index + 2))
    expectEventsToEqual(
      streamEventsSliced1.map(e => e.event),
      expectedEvents1.slice(1),
    )

    const streamEventsSliced2 = await eventStore.getStream(id2, 2)
    streamEventsSliced2.forEach((event, index) =>
      expect(event.sequence).toEqual(index + streamEvents1.length + 2),
    )
    expectEventsToEqual(
      streamEventsSliced2.map(e => e.event),
      expectedEvents2.slice(1),
    )

    const events = await eventStore.getEvents()
    events.forEach((event, index) => expect(event.sequence).toEqual(index + 1))
    expectEventsToEqual(
      events.map(e => e.event),
      [...expectedEvents1, ...expectedEvents2],
    )

    const eventsCut = await eventStore.getEvents(3)
    eventsCut.forEach((event, index) => expect(event.sequence).toEqual(index + 3))
    expectEventsToEqual(
      eventsCut.map(e => e.event),
      [...expectedEvents1, ...expectedEvents2].slice(2),
    )
  })

  it('dispatches stored events', async () => {
    const bankAccount1 = BankAccount.open(id3, 100)
    const eventListener = container.get(EventListenerMock)
    const listener = await eventListener.consume('test', 'event-sourcing.bankAccount')

    const consumedEvents: ESEvent[] = []
    listener.subscribe(({message}) =>
      consumedEvents.push(ESEvent.fromObject(JSON.parse(message.value!.toString()))),
    )
    await eventStore.store(bankAccount1)

    const expectedEvents = [
      new ESEvent(
        EventName.fromString(BankEventNames.Opened),
        id3,
        classToObject(new BankAccountOpened(id3.toString())),
        1,
      ),
      new ESEvent(
        EventName.fromString(BankEventNames.Deposited),
        id3,
        classToObject(new MoneyDeposited(100)),
        2,
      ),
    ]
    expectEventsToEqual(consumedEvents, expectedEvents)
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

  afterAll(async () => {
    await mongod.stop()
  })
})
