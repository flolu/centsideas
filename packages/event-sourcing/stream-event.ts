import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {IDomainEvent} from './domain-event';

class StreamEvent {
  constructor(public readonly event: IDomainEvent, public readonly version: StreamVersion) {}
}

export class StreamEvents {
  constructor(public readonly aggregateId: Id, private readonly events: StreamEvent[]) {}

  static empty(id: Id) {
    return new StreamEvents(id, []);
  }

  add(event: IDomainEvent, version: StreamVersion) {
    /**
     * create a copy of the `StreamVersion` because it would otherwise
     * continue counting when this.version.next() is invoked
     */
    const versionCopy = StreamVersion.fromNumber(version.toNumber());
    this.events.push(new StreamEvent(event, versionCopy));
  }

  toArray() {
    return this.events;
  }

  toEvents() {
    return this.events.map(e => e.event);
  }
}
