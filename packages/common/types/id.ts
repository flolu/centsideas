import {v4 as uuidv4} from 'uuid'

import {Exception} from './exception'
import {GenericErrors, RpcStatus} from '../enums'

export class Id {
  protected static regex = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )

  protected constructor(protected readonly id: string) {}

  static generate() {
    return new Id(uuidv4())
  }

  static fromString(id: string) {
    if (!Id.regex.test(id)) throw new InvalidId(id)
    return new Id(id)
  }

  equals(that: Id) {
    return this.id === that.toString()
  }

  toString() {
    return this.id
  }
}

export class InvalidId extends Exception {
  name = GenericErrors.InvalidId
  code = RpcStatus.INVALID_ARGUMENT

  constructor(id: string) {
    super(`Id: ${id} is invalid`)
  }
}
