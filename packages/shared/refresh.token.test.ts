import {Id, UserRole} from '@centsideas/common/types'

import {RefreshToken} from './refresh.token'
import {TokenUser} from './token-user'

describe('refresh token', () => {
  const session = Id.generate()
  const user = TokenUser.fromValues(Id.generate(), UserRole.Basic())
  const refreshCount = 42
  const secret = 'abc'

  it('cant be created (from string) and serialized', () => {
    const token1 = new RefreshToken(session, refreshCount, user)
    const token1str = token1.sign(secret, 1000)
    const token2 = RefreshToken.fromString(token1str, secret)
    expect(token1.sessionId).toEqual(session)
    expect(token1.count).toEqual(refreshCount)
    expect(token1.user).toEqual(user)
    expect(token1).toEqual(token2)
  })
})
