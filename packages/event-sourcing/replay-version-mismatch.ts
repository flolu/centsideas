import {Exception} from '@centsideas/utils';
import {RpcStatus, EventSourcingErrorNames} from '@centsideas/enums';
import {PersistedEvent} from '@centsideas/models';

import {StreamVersion} from './stream-version';

export class ReplayVersionMismatch extends Exception {
  code = RpcStatus.INTERNAL;
  name = EventSourcingErrorNames.ReplayVersionMismatch;

  constructor(event: PersistedEvent, aggregateVersion: StreamVersion) {
    super(
      `Version mismatch while replaying event ${event.id} of aggregate` +
        `with id ${event.streamId}. Aggregate version was at ` +
        `${aggregateVersion.toNumber()} and event version is ` +
        `${event.version}`,
    );
  }
}
