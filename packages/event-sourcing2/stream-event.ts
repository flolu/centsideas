import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';
import {DomainEvent} from './domain-event';

export class StreamEvent {
  constructor(
    public readonly id: Id,
    public readonly version: StreamVersion,
    public readonly event: DomainEvent,
  ) {}
}
