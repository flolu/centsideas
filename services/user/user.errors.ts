import {Exception, Id} from '@centsideas/common/types'
import {UserErrors, RpcStatus} from '@centsideas/common/enums'

export class UserAlreadyDeleted extends Exception {
  name = UserErrors.AlreadyDeleted
  code = RpcStatus.INVALID_ARGUMENT

  constructor(userId: Id) {
    super(`User with id ${userId} has already been deleted.`)
  }
}
