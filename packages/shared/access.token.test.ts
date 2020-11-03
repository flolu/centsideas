import {Id, UserRole} from '@centsideas/common/types'

import {AccessToken} from './access.token'
import {TokenUser} from './token-user'

describe('access token', () => {
  const session = Id.generate()
  const user = TokenUser.fromValues(Id.generate(), UserRole.Basic())
  const secret = 'abc'

  it('cant be created (from string) and serialized', () => {
    const token1 = new AccessToken(session, user)
    const token1str = token1.sign(secret, 1000)
    const token2 = AccessToken.fromString(token1str, secret)
    expect(token1.sessionId).toEqual(session)
    expect(token1.user).toEqual(user)
    expect(token1).toEqual(token2)
  })
})
