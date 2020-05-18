import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {StreamEvent} from './stream-event';

export abstract class Aggregate {
  private pendingEvents: StreamEvent[] = [];
  private version: StreamVersion = StreamVersion.start();

  protected replay(events: any[]) {
    events.forEach(this.apply);
  }

  // TODO type
  protected raise(event: any) {
    this.apply(event);
    this.pendingEvents.push(new StreamEvent(this.id, this.version, event));
  }

  apply(event: any) {
    this.invokeApplyMethod(event);
    this.version.next();
  }

  abstract id: Id;
  abstract invokeApplyMethod(event: any): void;
}
