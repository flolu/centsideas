import {Exception} from '@centsideas/common/types'
import {EventSourcingErrors, RpcStatus} from '@centsideas/common/enums'

const regex = new RegExp(/^[A-Z]+$/i)

export class EventName {
  constructor(
    public readonly name: string,
    public readonly aggregate: string,
    public readonly service?: string,
  ) {
    if (!regex.exec(name)) throw new EventNameInvalid(name)
    if (!regex.exec(aggregate)) throw new EventNameInvalid(aggregate)
    if (service && !regex.exec(service)) throw new EventNameInvalid(service)
  }

  static fromString(rawName: string) {
    if (!rawName.includes(':')) throw new EventNameInvalid(rawName)
    const [namespace, name] = rawName.split(':')
    const aggregate = namespace.includes('.')
      ? namespace.substring(namespace.lastIndexOf('.') + 1, namespace.length)
      : namespace
    const service = namespace.includes('.')
      ? namespace.substring(0, namespace.indexOf('.'))
      : undefined
    return new EventName(name, aggregate, service)
  }

  toString() {
    return this.service
      ? `${this.service}.${this.aggregate}:${this.name}`
      : `${this.aggregate}:${this.name}`
  }

  equals(that: EventName) {
    return (
      this.name === that.name && this.aggregate === that.aggregate && this.service === that.service
    )
  }

  equalsString(thatString: string) {
    return this.equals(EventName.fromString(thatString))
  }
}

export class EventNameInvalid extends Exception {
  name = EventSourcingErrors.InvalidEventName
  code = RpcStatus.INTERNAL

  constructor(invalidName: string) {
    super(`Event name ${invalidName} is invalid.`)
  }
}
