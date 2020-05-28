import {Exception} from '@centsideas/utils';
import {RpcStatus, EventSourcingErrorNames} from '@centsideas/enums';

/**
 * Before events are saved to event store they are validated
 * using the current state.
 * This error is thrown when the state of the aggragate
 * changed during validation
 *
 * More details here:
 * https://youtu.be/GzrZworHpIk?t=1028
 */
export class OptimisticConcurrencyIssue extends Exception {
  code = RpcStatus.ABORTED;
  name = EventSourcingErrorNames.OptimisticConcurrencyIssue;

  constructor(
    eventStore: string,
    streamId: string,
    lastVersion: number,
    bookmark: number,
    lastEventId: string,
  ) {
    super('Optimistic concurrency issue', {
      eventStore,
      streamId,
      lastVersion,
      bookmark,
      lastEventId,
    });
  }
}
