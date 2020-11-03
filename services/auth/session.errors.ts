import {Exception} from '@centsideas/common/types'
import {SessionErrors, RpcStatus} from '@centsideas/common/enums'

export class NotSignedIn extends Exception {
  name = SessionErrors.NotSignedIn
  code = RpcStatus.UNAUTHENTICATED

  constructor() {
    super('You are not signed in.')
  }
}

export class SessionRevoked extends Exception {
  name = SessionErrors.Revoked
  code = RpcStatus.PERMISSION_DENIED

  constructor() {
    super('This session has been revoked.')
  }
}
