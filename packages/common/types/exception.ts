import {Timestamp} from './timestamp'
import {RpcStatus} from '../enums'

export abstract class Exception extends Error {
  abstract name: string
  abstract code: RpcStatus

  public timestamp = Timestamp.now()

  constructor(public message: string, public details?: any) {
    super(message)
  }

  serialize() {
    return {
      name: this.name,
      code: this.code.toString(),
      message: this.message,
      timestamp: this.timestamp.toString(),
      details: this.details,
    }
  }
}
