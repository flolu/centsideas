import {Exception} from '@centsideas/common/types'
import {EventSourcingErrors, RpcStatus} from '@centsideas/common/enums'

export class OptimisticConcurrencyIssue extends Exception {
  name = EventSourcingErrors.OptimisticConcurrencyIssue
  code = RpcStatus.ABORTED

  constructor(lastEventId: string, lastPersistedVersion: number) {
    super('Optimistic concurrency issue.', {lastEventId, lastPersistedVersion})
  }
}
