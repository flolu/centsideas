import {EventTopics} from '@centsideas/enums';
import {EventName} from '@centsideas/types/event-name';

import {EventsHandler} from './events-handler';

export const EVENTS_HANDLER_TOPICS = '__eventsHandlerTopics__';

/**
 * Use this decorator only for actions that need to happen ONCE.
 * It is okay to use on write-side
 * It is not okay to use in projectors!
 */
export const EventHandler = (eventNameString: string) => {
  return (target: any, propertyKey: string) => {
    if (!(target instanceof EventsHandler))
      throw new Error(
        `@EventsHandler() decorator can only be used inside an EventsHandler class.` +
          ` But ${target} does not extend EventsHandler!`,
      );
    const eventName = EventName.fromString(eventNameString);
    Reflect.defineMetadata(eventName.toString(), propertyKey, target);

    const topic = eventName.getTopic();
    if (
      !Object.values(EventTopics)
        .map(t => t.toString())
        .includes(topic)
    )
      throw new Error(`No topic ${topic} found in EventTopics enum`);

    const topics: string[] = Reflect.getMetadata(EVENTS_HANDLER_TOPICS, target) || [];
    const updatedTopics = topics.includes(topic) ? topics : [...topics, topic];
    Reflect.defineMetadata(EVENTS_HANDLER_TOPICS, updatedTopics, target);
  };
};
