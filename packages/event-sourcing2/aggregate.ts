import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {StreamEvent} from './stream-event';
import {DomainEvent} from './domain-event';

export abstract class Aggregate {
  private pendingEvents: StreamEvent[] = [];
  private version: StreamVersion = StreamVersion.start();

  flushEvents(): StreamEvent[] {
    const events = [...this.pendingEvents];
    this.pendingEvents = [];
    return events;
  }

  protected replay(events: DomainEvent[]) {
    events.forEach(this.apply);
  }

  // TODO type DomainEvent might be inappropriate because it is actually Somehting implements DomainEvent
  protected raise(event: DomainEvent) {
    this.apply(event);
    this.pendingEvents.push(new StreamEvent(this.id, this.version, event));
  }

  protected apply(event: DomainEvent) {
    this.invokeApplyMethod(event);
    this.version.next();
  }

  protected abstract id: Id;
  protected abstract invokeApplyMethod(event: DomainEvent): void;
}
