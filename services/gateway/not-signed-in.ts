import {Exception} from '@centsideas/common/types'
import {GenericErrors, RpcStatus} from '@centsideas/common/enums'

export class NotSignedIn extends Exception {
  name = GenericErrors.NotSignedIn
  code = RpcStatus.UNAUTHENTICATED

  constructor(sessionId: string) {
    super('Not authenticated.', {sessionId})
  }
}
