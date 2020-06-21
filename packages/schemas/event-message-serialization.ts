import * as path from 'path';
import * as protobuf from 'protobufjs';

import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';

import {SchemaMessage} from './schema-message';
import {IdeaEventMessage} from './idea';
import {AuthenticationEventMessage} from './authentication';
import {UserEventMessage, PrivateUserEventMessage} from './user';

// TODO a better solution would be a appriciated! (maybe via decorator?!)
const topicMessageMap = new Map<EventTopics, SchemaMessage>();
topicMessageMap.set(EventTopics.Idea, IdeaEventMessage);
topicMessageMap.set(EventTopics.Authentication, AuthenticationEventMessage);
topicMessageMap.set(EventTopics.User, UserEventMessage);
topicMessageMap.set(EventTopics.PrivateUser, PrivateUserEventMessage);

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
  const extractedKey = extractKeyFromEventName(event.name);
  const message = Message.create({
    ...event,
    data: {[extractedKey]: event.data},
  });

  return Message.encode(message).finish() as Buffer;
}

// TODO a better solution would be a appriciated! (maybe via decorator?!)
const eventMessageMap = new Map<string, SchemaMessage>();
eventMessageMap.set('idea', IdeaEventMessage);
eventMessageMap.set('authentication', AuthenticationEventMessage);
eventMessageMap.set('user', UserEventMessage);
eventMessageMap.set('privateUser', PrivateUserEventMessage);

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
  const extractedKey = extractKeyFromEventName(decoded.name);
  const data = (decoded.data as any)[extractedKey];
  if (data === undefined)
    throw new Error(
      `event name ${decoded.name} is likely wrong! Please double check implementation!`,
    );

  return {...decoded, data};
}
