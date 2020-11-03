import {Timestamp, Id} from '@centsideas/common/types'

import {EventName} from './event-name'

export interface SerializedESEvent<T = any> {
  name: string
  aggregateId: string
  payload: T
  version: number
  timestamp: string
}

export class ESEvent<T = any> {
  constructor(
    public readonly name: EventName,
    public readonly aggregateId: Id,
    public readonly payload: T,
    public readonly version: number,
    public readonly timestamp = Timestamp.now(),
  ) {}

  static fromObject(obj: SerializedESEvent) {
    return new ESEvent(
      EventName.fromString(obj.name),
      Id.fromString(obj.aggregateId),
      obj.payload,
      obj.version,
      Timestamp.fromString(obj.timestamp),
    )
  }

  serialize(): SerializedESEvent<T> {
    return {
      name: this.name.toString(),
      aggregateId: this.aggregateId.toString(),
      payload: this.payload,
      version: this.version,
      timestamp: this.timestamp.toString(),
    }
  }
}
