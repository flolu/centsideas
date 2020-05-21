import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {StreamEvent} from './stream-event';
import {DomainEvent} from './domain-event';

export abstract class Aggregate {
  private events: StreamEvent[] = [];
  private version: StreamVersion = StreamVersion.start();

  pendingEvents(): StreamEvent[] {
    const events = [...this.events];
    // TODO really remove events here?
    this.events = [];
    return events;
  }

  get aggregateVersion() {
    return this.version.toNumber();
  }

  protected replay(events: DomainEvent[]) {
    events.forEach(e => this.apply(e));
  }

  protected raise(event: DomainEvent) {
    this.apply(event);
    /**
     * create a copy of the `StreamVersion` because it would otherwise
     * continue counting when this.version.next() is invoked
     */
    this.events.push(
      new StreamEvent(this.id, StreamVersion.fromNumber(this.version.toNumber()), event),
    );
  }

  protected apply(event: DomainEvent) {
    this.invokeApplyMethod(event);
    this.version.next();
  }

  protected abstract id: Id;
  protected abstract invokeApplyMethod(event: DomainEvent): void;
}
