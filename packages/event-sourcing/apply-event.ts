import {DomainEventInstance, EVENT_NAME_METADATA} from './domain-event';

/**
 * Takes an event class as an argument of the decorator
 * The method which is decorated will be called to handle
 * the aggregates state update
 */
export const Apply = (Event: DomainEventInstance<any>) => {
  return function ApplyDecorator(target: any, methodName: string) {
    /**
     * Get the event's name from the metadata saved on the
     * class of the event
     */
    const eventName = Reflect.getMetadata(EVENT_NAME_METADATA, Event.prototype);
    /**
     * Save the @param methodName of the handler method
     * on the @param target class and associate it with the
     * @param eventName
     *
     * This metadata is used in the @method apply of the
     * aggragate base class
     */
    Reflect.defineMetadata(eventName, methodName, target);
  };
};
