import {EventTopics} from '@centsideas/enums';

export const serializableMessageMap = new Map();

export const SerializableMessage = (topic: EventTopics) => {
  return function SerializableMessageDecorator(target: any) {
    serializableMessageMap.set(topic, new target());
  };
};
