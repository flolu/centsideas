import 'reflect-metadata'

import {Id} from '@centsideas/common/types'

import {ESEvent} from './es-event'
import {EventName} from './event-name'
import {
  BankAccount,
  expectEventsToContain,
  BankEventNames,
  BankAccountOpened,
  MoneyDeposited,
  MoneyWithdrawn,
  BankAccountClosed,
  BankAccountAlreadyClosed,
  NotEnoughMoney,
  generateSampleEvents,
} from './testing'
import {
  CannotFlushEmptyAggregate,
  EmptyReplay,
  Aggregate,
  EventNameForPayloadNotFound,
} from './aggregate'
import {Snapshot} from './snapshot'

describe('example bank account aggregate', () => {
  it('opens a bank account', () => {
    const id = Id.generate()
    const amount = 100
    const account = BankAccount.open(id, amount)

    const events = account.flushEvents()
    expectEventsToContain(
      events,
      new ESEvent(
        EventName.fromString(BankEventNames.Opened),
        id,
        new BankAccountOpened(id.toString()),
        1,
      ),
    )
    expectEventsToContain(
      events,
      new ESEvent(
        EventName.fromString(BankEventNames.Deposited),
        id,
        new MoneyDeposited(amount),
        2,
      ),
    )

    const state = account.currentState
    state.lastTransactionAt = undefined
    expect(state).toEqual({
      id: id.toString(),
      balance: amount,
      transactions: 1,
      lastTransactionAt: undefined,
      closedAt: undefined,
    })

    account.flushEvents()
    expect(account.snapshot).toEqual(new Snapshot(id, events.version, account.currentState))
  })

  it('deposites and withdraws money', () => {
    const id = Id.generate()
    const amount = 100
    const account = BankAccount.open(id, amount)

    account.deposit(10)
    const state1 = account.currentState
    state1.lastTransactionAt = undefined
    expect(state1).toEqual({
      id: id.toString(),
      balance: 110,
      transactions: 2,
      lastTransactionAt: undefined,
      closedAt: undefined,
    })

    account.withdraw(50)
    const state2 = account.currentState
    state2.lastTransactionAt = undefined
    expect(state2).toEqual({
      id: id.toString(),
      balance: 60,
      transactions: 3,
      lastTransactionAt: undefined,
      closedAt: undefined,
    })

    const events = account.flushEvents()
    expectEventsToContain(
      events,
      new ESEvent(EventName.fromString(BankEventNames.Deposited), id, new MoneyDeposited(10), 3),
    )

    expectEventsToContain(
      events,
      new ESEvent(
        EventName.fromString(BankEventNames.MoneyWithdrawn),
        id,
        new MoneyWithdrawn(50),
        4,
      ),
    )

    expect(account.snapshot).toEqual(new Snapshot(id, events.version, account.currentState))
  })

  it('closes the bank account', () => {
    const id = Id.generate()
    const amount = 100
    const account = BankAccount.open(id, amount)

    account.close()
    const state = account.currentState
    state.lastTransactionAt = undefined
    state.closedAt = undefined
    expect(state).toEqual({
      id: id.toString(),
      balance: amount,
      transactions: 1,
      lastTransactionAt: undefined,
      closedAt: undefined,
    })

    const events = account.flushEvents()
    expectEventsToContain(
      events,
      new ESEvent(EventName.fromString(BankEventNames.Closed), id, new BankAccountClosed(), 3),
    )
    expect(account.snapshot).toEqual(new Snapshot(id, events.version, account.currentState))
  })

  it('prevents new transactions when bank account is already closed', () => {
    const id = Id.generate()
    const amount = 100
    const account = BankAccount.open(id, amount)

    account.close()

    expect(() => account.deposit(13)).toThrow(new BankAccountAlreadyClosed())
    expect(() => account.withdraw(13)).toThrow(new BankAccountAlreadyClosed())
    expect(() => account.close()).toThrow(new BankAccountAlreadyClosed())
  })

  it('prevents from withdrawing too much money', () => {
    const id = Id.generate()
    const amount = 100
    const account = BankAccount.open(id, amount)

    expect(() => account.withdraw(200)).toThrow(new NotEnoughMoney())
  })

  it('replays events', () => {
    const id = Id.generate()

    const {events, t1, t2} = generateSampleEvents(id)
    const account = BankAccount.buildFrom(events)

    expect(account.currentState).toEqual({
      id: id.toString(),
      balance: 60,
      transactions: 3,
      lastTransactionAt: t1.toString(),
      closedAt: t2.toString(),
    })
    expect(account.persistedVersion).toEqual(events.length)
  })

  it('cannot flush events of an empty aggregate', () => {
    const empty = new BankAccount()
    expect(() => empty.flushEvents()).toThrow(new CannotFlushEmptyAggregate())
  })

  it('does not allow to replay an empty list of events', () => {
    expect(() => BankAccount.buildFrom([])).toThrow(new EmptyReplay())
  })

  it('throws when event name cannot be associated with event payload', () => {
    class Sample extends Aggregate<{}> {
      protected id!: Id

      static buildFrom(events: ESEvent[]) {
        return new Sample().replay(events)
      }

      command() {
        this.raise(new SampleTestEvent())
      }

      applyState(_state: {}) {
        //
      }

      get currentState() {
        return {}
      }
    }

    class SampleTestEvent {}

    const sample = new Sample()
    expect(() => sample.command()).toThrow(new EventNameForPayloadNotFound(new SampleTestEvent()))
  })
})
