import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {StreamEvents} from './stream-event';
import {DomainEvent} from './domain-event';

export abstract class Aggregate {
  protected abstract id: Id;
  protected abstract invokeApplyMethod(event: DomainEvent): void;

  private events: StreamEvents | undefined;
  private version = StreamVersion.start();
  private persistedVersion = StreamVersion.start();

  flushEvents() {
    const events = this.events || StreamEvents.empty(this.id);
    this.events = StreamEvents.empty(this.id);
    return events;
  }

  get persistedAggregateVersion() {
    return this.persistedVersion.toNumber();
  }

  get aggregateVersion() {
    return this.version.toNumber();
  }

  protected replay(events: DomainEvent[]) {
    events.forEach(e => this.apply(e, true));
  }

  protected raise(event: DomainEvent) {
    this.apply(event);
    if (!this.events) this.events = StreamEvents.empty(this.id);
    this.events.add(event, this.version);
  }

  protected apply(event: DomainEvent, inReplay = false) {
    this.invokeApplyMethod(event);
    if (inReplay) this.persistedVersion.next();
    this.version.next();
  }
}
