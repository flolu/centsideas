import {EventsHandler} from './events-handler';
import {EventTopics} from '@centsideas/enums';

export const EVENTS_HANDLER_TOPICS = '__eventsHandlerTopics__';

export const EventHandler = (eventName: string) => {
  return (target: any, propertyKey: string) => {
    if (!(target instanceof EventsHandler))
      throw new Error(
        `@EventsHandler() decorator can only be used inside an Projector class.` +
          ` But ${target} does not extend EventsHandler!`,
      );
    Reflect.defineMetadata(eventName, propertyKey, target);

    const topic = `centsideas.events.${eventName.split('.')[0]}`;
    if (
      !Object.values(EventTopics)
        .map(t => t.toString())
        .includes(topic)
    )
      throw new Error(
        `Could not extract valid event topic from event name ${eventName}!` +
          ` The event name should look like <topic>.someEvent, where <topic> is in the EventTopics enum.`,
      );

    const topics: string[] = Reflect.getMetadata(EVENTS_HANDLER_TOPICS, target) || [];
    const updatedTopics = topics.includes(topic) ? topics : [...topics, topic];
    Reflect.defineMetadata(EVENTS_HANDLER_TOPICS, updatedTopics, target);
  };
};
