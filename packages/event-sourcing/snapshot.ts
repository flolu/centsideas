import {Id} from '@centsideas/common/types'

export interface SerializedSnapshot<T = any> {
  aggregateId: string
  version: number
  state: T
}

export class Snapshot<T = any> {
  constructor(
    public readonly aggregateId: Id,
    public readonly version: number,
    public readonly state: T,
  ) {}

  static fromObject(obj: SerializedSnapshot) {
    return new Snapshot(Id.fromString(obj.aggregateId), obj.version, obj.state)
  }

  serialize(): SerializedSnapshot<T> {
    return {
      aggregateId: this.aggregateId.toString(),
      version: this.version,
      state: this.state,
    }
  }
}
