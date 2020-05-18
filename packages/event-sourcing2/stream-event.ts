import {Id} from '@centsideas/types';

import {StreamVersion} from './stream-version';

export class StreamEvent {
  constructor(
    public readonly id: Id,
    public readonly version: StreamVersion,
    public readonly event: any,
  ) {}
}
