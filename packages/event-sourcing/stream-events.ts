import {Id, Timestamp, Exception} from '@centsideas/common/types'
import {EventSourcingErrors, RpcStatus} from '@centsideas/common/enums'

import {ESEvent} from './es-event'
import {EventName} from './event-name'

export class StreamEvents {
  private currentVersion: number

  constructor(
    public readonly aggregateId: Id,
    private readonly events: ESEvent[],
    private readonly startVersion = 0,
  ) {
    this.currentVersion = this.startVersion
  }

  static empty(aggregateId: Id, startVersion = 0) {
    return new StreamEvents(aggregateId, [], startVersion)
  }

  add(name: EventName, payload: any, timestamp: Timestamp) {
    const event = new ESEvent(name, this.aggregateId, payload, this.nextVersion, timestamp)

    const aggregateName = this.lastEvent ? this.lastEvent.name.aggregate : event.name.aggregate

    if (this.lastEvent && event.timestamp.isBefore(this.lastEvent.timestamp, false))
      throw new WrongChronologicalOrdering(
        aggregateName,
        this.aggregateId.toString(),
        event.version,
      )

    if (this.lastEvent && event.name.aggregate !== this.lastEvent.name.aggregate)
      throw new InconsistentAggregateType(
        event.name.aggregate,
        this.lastEvent.name.aggregate,
        this.aggregateId.toString(),
        event.name.toString(),
      )

    this.increaseVersion()
    this.events.push(event)
  }

  increaseVersion() {
    this.currentVersion += 1
  }

  toArray() {
    return this.events
  }

  toPayloads() {
    return this.events.map(e => e.payload)
  }

  get version() {
    return this.currentVersion
  }

  private get lastEvent(): ESEvent | undefined {
    return this.events[this.events.length - 1]
  }

  private get nextVersion() {
    return this.currentVersion + 1
  }
}

export class InconsistentAggregateType extends Exception {
  name = EventSourcingErrors.InconsistentAggregateType
  code = RpcStatus.INTERNAL

  constructor(
    wrongAggregateName: string,
    expectedAggregateName: string,
    aggregateId: string,
    wrongEventName: string,
  ) {
    super('Inconsistent use of aggregate types.', {
      wrongAggregateName,
      expectedAggregateName,
      aggregateId,
      wrongEventName,
    })
  }
}

export class WrongChronologicalOrdering extends Exception {
  name = EventSourcingErrors.WrongChronologicalOrdering
  code = RpcStatus.INTERNAL

  constructor(aggregateName: string, aggregateId: string, eventVersion: number) {
    super('Found unordered event version', {aggregateName, aggregateId, eventVersion})
  }
}
