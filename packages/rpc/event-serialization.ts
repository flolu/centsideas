import {PersistedEvent} from '@centsideas/models';

export function extractKeyFromEventName(eventName: string) {
  return eventName.substring(eventName.indexOf('.') + 1, eventName.length);
}

export function serializeEvent(event: PersistedEvent): PersistedEvent {
  const data = event.data;
  return {
    ...event,
    data: {
      [extractKeyFromEventName(event.name)]: data,
    },
  };
}

export function deserializeEvent(event: PersistedEvent): PersistedEvent {
  return {
    ...event,
    data: (event.data as any)[extractKeyFromEventName(event.name)],
  };
}
