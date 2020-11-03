import {RpcStatus, UserErrors} from '@centsideas/common/enums'
import {Email, Exception, Id, Username} from '@centsideas/common/types'

export class UserNotFound extends Exception {
  name = UserErrors.NotFound
  code = RpcStatus.NOT_FOUND

  constructor(query: {email?: Email; username?: Username; id?: Id}) {
    super(`User not found.`, {
      email: query.email?.toString(),
      username: query.username?.toString(),
      id: query.id?.toString(),
    })
  }
}
