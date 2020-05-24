import {PersistedEvent} from '@centsideas/event-sourcing2';

export function extractKeyFromEventName(eventName: string) {
  return eventName.substring(eventName.indexOf('.') + 1, eventName.length);
}

export function serializeEvent(event: PersistedEvent) {
  const data = event.data;
  const ser = {
    ...event,
    data: {
      [extractKeyFromEventName(event.name)]: data,
    },
  };
  return ser;
}

export function deserializeEvent(event: PersistedEvent) {
  const deser = {
    ...event,
    data: (event.data as any)[extractKeyFromEventName(event.name)],
  };
  return deser;
}
