import {DomainEventInstance, EVENT_NAME_METADATA} from './domain-event';

export const Apply = (Event: DomainEventInstance<any>) => {
  return function ApplyDecorator(target: any, methodName: string) {
    const eventName = Reflect.getMetadata(EVENT_NAME_METADATA, Event.prototype);
    Reflect.defineMetadata(eventName, methodName, target);
  };
};
