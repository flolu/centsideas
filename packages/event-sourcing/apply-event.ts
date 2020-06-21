import {EventName} from '@centsideas/types/event-name';

import {DomainEventInstance, EVENT_NAME_METADATA} from './domain-event';
import {Aggregate} from './aggregate';

/**
 * Takes an event class as an argument of the decorator
 * The method which is decorated will be called to handle
 * the aggregates state update
 */
export const Apply = (Event: DomainEventInstance<any>) => {
  return function ApplyDecorator(target: any, propertyKey: string) {
    if (!(target instanceof Aggregate))
      throw new Error(
        `@Apply() decorator can only be used inside an Aggregate class.` +
          ` But ${target} does not extend Aggregate!`,
      );
    /**
     * Get the event's name from the metadata saved on the
     * class of the event
     */
    const eventName = EventName.fromString(
      Reflect.getMetadata(EVENT_NAME_METADATA, Event.prototype),
    );
    /**
     * Save the @param propertyKey of the handler method
     * on the @param target class and associate it with the
     * @param eventName
     *
     * This metadata is used in the @method apply of the
     * aggragate base class
     */
    Reflect.defineMetadata(eventName.toString(), propertyKey, target);
  };
};
