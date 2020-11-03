import {Id, Timestamp, Exception} from '@centsideas/common/types'
import {EventSourcingErrors, RpcStatus} from '@centsideas/common/enums'

import {ESEvent} from './es-event'
import {EVENT_NAME_METADATA} from './constants'
import {EventName} from './event-name'
import {StreamEvents} from './stream-events'
import {Snapshot} from './snapshot'

export abstract class Aggregate<TState> {
  protected abstract id: Id
  protected abstract get currentState(): TState
  protected abstract applyState(state: TState): void

  private events: StreamEvents | undefined
  private persistedAggregateVersion = 0

  flushEvents() {
    if (!this.id) throw new CannotFlushEmptyAggregate()
    const events = this.events
    this.events = StreamEvents.empty(this.id, events?.version)
    return events || this.events
  }

  get persistedVersion() {
    return this.persistedAggregateVersion
  }

  get snapshot() {
    if (!this.events)
      throw new Error('Cannot create snapshot when aggregate events are not yet initialized.')
    return new Snapshot<TState>(this.id, this.events.version, this.currentState)
  }

  get aggregateId() {
    return this.id
  }

  protected static build<T>(AggregateClass: new () => T, events: ESEvent[], snapshot?: Snapshot) {
    const instance = new AggregateClass()
    if (snapshot) (instance as any).applySnapshot(snapshot, events)
    else (instance as any).replay(events)
    return instance
  }

  protected raise(payload: any) {
    const name = this.getEventNameFromPayload(payload)
    const timestamp = Timestamp.now()
    this.callApplyMethod(name, payload, timestamp)

    if (!this.events) this.events = StreamEvents.empty(this.id)
    this.events.add(name, payload, timestamp)

    return this
  }
  protected replay(events: ESEvent[]) {
    if (!events.length) throw new EmptyReplay()
    if (!this.events)
      this.events = StreamEvents.empty(events[0].aggregateId, this.persistedAggregateVersion)

    events.forEach(event => {
      this.callApplyMethod(event.name, event.payload, event.timestamp)
      this.persistedAggregateVersion += 1
      this.events!.increaseVersion()
    })

    return this
  }

  protected applySnapshot(snapshot: Snapshot<TState>, events: ESEvent[]) {
    this.id = snapshot.aggregateId
    this.persistedAggregateVersion = snapshot.version
    this.applyState(snapshot.state)
    this.events = StreamEvents.empty(this.aggregateId, snapshot.version)
    if (!events.length) return
    if (events[0].version !== snapshot.version + 1)
      throw new SnapshotEventsVersionMismatch(snapshot.version, events[0].version)
    this.replay(events)
  }

  private callApplyMethod(name: EventName, payload: any, timestamp: Timestamp) {
    const methodName = Reflect.getMetadata(name.toString(), this)
    if (!methodName) return
    if (methodName) (this as any)[methodName](payload, timestamp)
  }

  private getEventNameFromPayload(payload: any) {
    const raw = Reflect.getMetadata(EVENT_NAME_METADATA, payload)
    if (!raw) throw new EventNameForPayloadNotFound(payload)
    const name = EventName.fromString(raw)
    return name
  }
}

export class EventNameForPayloadNotFound extends Exception {
  name = EventSourcingErrors.EventNameForPayloadNotFound
  code = RpcStatus.INTERNAL

  constructor(payload: any) {
    super(`Couldn't find event name for event payload ${payload}.`, {payload})
  }
}

export class EmptyReplay extends Exception {
  name = EventSourcingErrors.EmptyReplay
  code = RpcStatus.INTERNAL

  constructor() {
    super('Cannot build aggregate from an empty list of events.')
  }
}

export class CannotFlushEmptyAggregate extends Exception {
  name = EventSourcingErrors.CannotFlushEmptyAggregate
  code = RpcStatus.INTERNAL

  constructor() {
    super('A non-initialized aggregates events cannot be flushed.')
  }
}

export class SnapshotEventsVersionMismatch extends Exception {
  name = EventSourcingErrors.SnapshotEventsVersionMismatch
  code = RpcStatus.INTERNAL

  constructor(snapshotVersion: number, firstEventVersion: number) {
    super('Version of event replayed after snapshot does not match.', {
      snapshotVersion,
      firstEventVersion,
    })
  }
}
