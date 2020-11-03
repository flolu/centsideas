import {Id} from '@centsideas/common/types'

import {ESEvent} from './es-event'

export interface SerializedPersistedESEvent<T = any> {
  id: string
  sequence: number
  name: string
  aggregateId: string
  payload: T
  version: number
  timestamp: string
}

export class PersistedESEvent<T = any> {
  constructor(
    public readonly id: Id,
    public readonly sequence: number,
    public readonly event: ESEvent<T>,
  ) {}

  static fromObject(object: SerializedPersistedESEvent) {
    return new PersistedESEvent(
      Id.fromString(object.id),
      object.sequence,
      ESEvent.fromObject({
        name: object.name,
        aggregateId: object.aggregateId,
        payload: object.payload,
        version: object.version,
        timestamp: object.timestamp,
      }),
    )
  }

  serialize(): SerializedPersistedESEvent<T> {
    return {
      id: this.id.toString(),
      sequence: this.sequence,
      ...this.event.serialize(),
    }
  }
}
