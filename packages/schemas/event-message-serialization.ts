import * as path from 'path';
import * as protobuf from 'protobufjs';

import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';

import {SchemaMessage} from './schema-message';
import {IdeaEventMessage} from './idea';

const topicMessageMap = new Map<EventTopics, SchemaMessage>();
topicMessageMap.set(EventTopics.Idea, IdeaEventMessage);

function extractKeyFromEventName(eventName: string) {
  return eventName.substring(eventName.indexOf('.') + 1, eventName.length);
}

export function serializeEventMessage(event: PersistedEvent, topic: EventTopics) {
  const messageData = topicMessageMap.get(topic);
  if (!messageData) throw new Error(`Please register message data for topic ${topic}!`);

  const root = protobuf.loadSync(path.join(__dirname, messageData.package, messageData.proto));
  const Message = root.lookupType(messageData.name);
  const message = Message.create({
    ...event,
    data: {[extractKeyFromEventName(event.name)]: event.data},
  });

  return Message.encode(message).finish() as Buffer;
}

const aggregateMessageMap = new Map<string, SchemaMessage>();
aggregateMessageMap.set('idea', IdeaEventMessage);

export function deserializeEventMessage(buffer: Buffer, eventName: string): PersistedEvent {
  const aggregate = eventName.split('.')[0];
  if (!aggregate)
    throw new Error(
      `Unknown aggregate: ${eventName}. Please name events like this: "aggregate.someEvent".`,
    );

  const messageData = aggregateMessageMap.get(aggregate);
  if (!messageData) throw new Error(`Please register message data for aggregate ${aggregate}!`);

  const root = protobuf.loadSync(path.join(__dirname, messageData.package, messageData.proto));
  const Message = root.lookupType(messageData.name);

  const decoded: PersistedEvent = Object(Message.decode(buffer));
  return {...decoded, data: (decoded.data as any)[extractKeyFromEventName(decoded.name)]};
}
