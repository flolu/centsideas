import {EVENT_NAME_METADATA} from './constants'
import {EventName} from './event-name'

export const Event = (name: string) => {
  return function Decorator(target: any) {
    Reflect.defineMetadata(
      EVENT_NAME_METADATA,
      EventName.fromString(name).toString(),
      target.prototype,
    )
  }
}
