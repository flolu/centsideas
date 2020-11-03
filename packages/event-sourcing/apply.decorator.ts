import {EVENT_NAME_METADATA} from './constants'
import {EventName} from './event-name'

export const Apply = (Event: any) => {
  return function Decorator(target: any, propertyKey: string) {
    const name: EventName = Reflect.getMetadata(EVENT_NAME_METADATA, Event.prototype)
    Reflect.defineMetadata(name.toString(), propertyKey, target)
  }
}
