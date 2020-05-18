import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';

export class StreamEvent {
  constructor(
    public readonly id: Id,
    public readonly version: StreamVersion,
    public readonly event: any,
  ) {}
}

export abstract class Aggregate {
  private pendingEvents: StreamEvent[] = [];
  private version: StreamVersion = StreamVersion.start();

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
  // NOW type
  abstract invokeApplyMethod(event: any): void;
}
