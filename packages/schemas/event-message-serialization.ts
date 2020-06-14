import * as path from 'path';
import * as protobuf from 'protobufjs';

import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';

import {SchemaMessage} from './schema-message';
import {IdeaEventMessage} from './idea';
import {AuthenticationEventMessage} from './authentication';

// FIXME a better solution would be a appriciated!
const topicMessageMap = new Map<EventTopics, SchemaMessage>();
topicMessageMap.set(EventTopics.Idea, IdeaEventMessage);
topicMessageMap.set(EventTopics.Authentication, AuthenticationEventMessage);

function extractKeyFromEventName(eventName: string) {
  return eventName.substring(eventName.lastIndexOf('.') + 1, eventName.length);
}

export function serializeEventMessage(event: PersistedEvent, topic: EventTopics) {
  const messageData = topicMessageMap.get(topic);
  if (!messageData)
    throw new Error(
      `Please register message data for topic ${topic} in packages/schemasa/event-message-serialization.ts!`,
    );

  const root = protobuf.loadSync(path.join(__dirname, messageData.package, messageData.proto));
  const Message = root.lookupType(messageData.name);
  const message = Message.create({
    ...event,
    data: {[extractKeyFromEventName(event.name)]: event.data},
  });

  return Message.encode(message).finish() as Buffer;
}

// FIXME a better solution would be a appriciated!
const eventMessageMap = new Map<string, SchemaMessage>();
eventMessageMap.set('idea', IdeaEventMessage);
eventMessageMap.set('authentication', AuthenticationEventMessage);

export function deserializeEventMessage(buffer: Buffer, eventName: string): PersistedEvent {
  const eventType = eventName.split('.')[0];
  if (!eventType)
    throw new Error(
      `Unknown event message: ${eventName}. Please name events like this: "aggregate.someEvent".`,
    );

  const messageData = eventMessageMap.get(eventType);
  if (!messageData)
    throw new Error(
      `Please register message data for event message type ${eventType} inside packages/schemasa/event-message-serialization.ts!`,
    );

  const root = protobuf.loadSync(path.join(__dirname, messageData.package, messageData.proto));
  const Message = root.lookupType(messageData.name);

  const decoded: PersistedEvent = Object(Message.decode(buffer));
  return {...decoded, data: (decoded.data as any)[extractKeyFromEventName(decoded.name)]};
}
