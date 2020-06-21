import {PersistedEvent} from '@centsideas/models';
import {EventName} from '@centsideas/types';

export function serializeEvent(event: PersistedEvent): PersistedEvent {
  const data = event.data;
  const eventName = EventName.fromString(event.name);
  return {
    ...event,
    data: {[eventName.name]: data},
  };
}

export function deserializeEvent(event: PersistedEvent): PersistedEvent {
  const eventName = EventName.fromString(event.name);
  return {
    ...event,
    data: (event.data as any)[eventName.name],
  };
}
