import {PersistedEvent} from '@centsideas/models';
import {EventTopics} from '@centsideas/enums';
import {EventName} from '@centsideas/types';

import {SchemaMessage} from './schema-message';
import {serializableMessageMap} from './serializable-message';

export function serializeEventMessage(event: PersistedEvent, topic: EventTopics) {
  const message = getMessage(topic);
  return message.encode(event);
}

export function deserializeEventMessage(buffer: Buffer, event: EventName): PersistedEvent {
  const message = getMessage(event.getTopic());
  return message.decode(buffer, event);
}

function getMessage(topic: EventTopics): SchemaMessage {
  return serializableMessageMap.get(topic);
}
