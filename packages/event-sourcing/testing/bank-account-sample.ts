import {Id, Timestamp} from '@centsideas/common/types'

import {Event, Aggregate, ESEvent, Apply, EventName} from '..'
import {Snapshot} from '../snapshot'
import {StreamEvents} from '../stream-events'

export interface BankAccountState {
  id: string
  balance: number
  transactions: number
  lastTransactionAt?: string
  closedAt?: string
}

export enum BankEventNames {
  Opened = 'bankAccount:opened',
  Closed = 'bankAccount:closed',
  Deposited = 'bankAccount:moneyDeposited',
  MoneyWithdrawn = 'bankAccount:moneyWithdrawn',
}

@Event(BankEventNames.Opened)
export class BankAccountOpened {
  constructor(public readonly id: string) {}
}

@Event(BankEventNames.Deposited)
export class MoneyDeposited {
  constructor(public readonly amount: number) {}
}

@Event(BankEventNames.MoneyWithdrawn)
export class MoneyWithdrawn {
  constructor(public readonly amount: number) {}
}

@Event(BankEventNames.Closed)
export class BankAccountClosed {}

export class BankAccountAlreadyClosed extends Error {
  constructor() {
    super('Bank account already closed.')
  }
}

export class NotEnoughMoney extends Error {
  constructor() {
    super('Not enough money.')
  }
}

export class BankAccount extends Aggregate<BankAccountState> {
  protected id!: Id
  private balance: number = 0
  private transactions: number = 0
  private lastTransactionAt?: Timestamp
  private closedAt?: Timestamp = undefined

  static buildFrom(events: ESEvent[], snapshot?: Snapshot<BankAccountState>) {
    return Aggregate.build(BankAccount, events, snapshot)
  }

  static open(id: Id, balance: number) {
    const account = new BankAccount()
    account.raise(new BankAccountOpened(id.toString()))
    account.raise(new MoneyDeposited(balance))
    return account
  }

  deposit(amount: number) {
    this.checkClosed()
    this.raise(new MoneyDeposited(amount))
  }

  withdraw(amount: number) {
    this.checkClosed()
    if (this.balance < amount) throw new NotEnoughMoney()
    this.raise(new MoneyWithdrawn(amount))
  }

  close() {
    this.checkClosed()
    this.raise(new BankAccountClosed())
  }

  applyState(state: BankAccountState) {
    this.balance = state.balance
    this.transactions = state.transactions
    this.lastTransactionAt = state.lastTransactionAt
      ? Timestamp.fromString(state.lastTransactionAt)
      : undefined
    this.closedAt = state.closedAt ? Timestamp.fromString(state.closedAt) : undefined
  }

  get currentState() {
    return {
      id: this.id.toString(),
      balance: this.balance,
      transactions: this.transactions,
      lastTransactionAt: this.lastTransactionAt?.toString(),
      closedAt: this.closedAt?.toString(),
    }
  }

  private checkClosed() {
    if (this.closedAt) throw new BankAccountAlreadyClosed()
  }

  @Apply(BankAccountOpened)
  private opened(payload: BankAccountOpened) {
    this.id = Id.fromString(payload.id)
  }

  @Apply(MoneyDeposited)
  private deposited(payload: MoneyDeposited, timestamp: Timestamp) {
    this.balance += payload.amount
    this.lastTransactionAt = timestamp
    this.transactions += 1
  }

  @Apply(MoneyWithdrawn)
  private withdrawn(payload: MoneyWithdrawn, timestamp: Timestamp) {
    this.balance -= payload.amount
    this.lastTransactionAt = timestamp
    this.transactions += 1
  }

  @Apply(BankAccountClosed)
  private closed(_payload: BankAccountClosed, timestamp: Timestamp) {
    this.closedAt = timestamp
  }
}

export function generateSampleEvents(id: Id) {
  const opened = new ESEvent(
    EventName.fromString(BankEventNames.Opened),
    id,
    new BankAccountOpened(id.toString()),
    1,
    Timestamp.fromString(`2000-08-02T10:09:00Z`),
  )
  const initDeposited = new ESEvent(
    EventName.fromString(BankEventNames.Deposited),
    id,
    new MoneyDeposited(100),
    2,
    Timestamp.fromString(`2000-08-02T10:10:00Z`),
  )
  const deposited = new ESEvent(
    EventName.fromString(BankEventNames.Deposited),
    id,
    new MoneyDeposited(10),
    3,
    Timestamp.fromString(`2000-08-02T10:11:00Z`),
  )
  const t1 = Timestamp.fromString(`2000-08-02T10:12:00Z`)
  const withdrawn = new ESEvent(
    EventName.fromString(BankEventNames.MoneyWithdrawn),
    id,
    new MoneyWithdrawn(50),
    4,
    t1,
  )
  const t2 = Timestamp.fromString(`2000-08-02T10:13:00Z`)
  const closed = new ESEvent(
    EventName.fromString(BankEventNames.Closed),
    id,
    new BankAccountClosed(),
    5,
    t2,
  )

  const events = [opened, initDeposited, deposited, withdrawn, closed]
  const streamEvents = StreamEvents.empty(id)
  events.forEach(e => streamEvents.add(e.name, e.payload, e.timestamp))
  const fakeAccountAggregate = {
    flushEvents: () => streamEvents,
    persistedVersion: 0,
    aggregateId: id,
    snapshot: new Snapshot<BankAccountState>(id, events.length, {
      id: id.toString(),
      balance: 150,
      transactions: 2,
      closedAt: closed.timestamp.toString(),
      lastTransactionAt: withdrawn.timestamp.toString(),
    }),
  }

  return {
    events,
    t1,
    t2,
    equivalentAccount: (fakeAccountAggregate as any) as BankAccount,
  }
}
