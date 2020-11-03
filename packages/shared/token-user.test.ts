import {Id, UserRole} from '@centsideas/common/types'

import {SerializedTokenUser, TokenUser} from './token-user'

describe('token user', () => {
  const serialized: SerializedTokenUser = {
    id: Id.generate().toString(),
    role: UserRole.Basic().toString(),
  }

  it('can be created from and converted to object', () => {
    const user = TokenUser.fromObject(serialized)
    expect(user.toObject()).toEqual(serialized)
  })

  it('can be created from values', () => {
    const user1 = TokenUser.fromValues(serialized.id, UserRole.fromString(serialized.role))
    const user2 = TokenUser.fromValues(
      Id.fromString(serialized.id),
      UserRole.fromString(serialized.role),
    )
    expect(user1).toEqual(user2)
    expect(user1.toObject()).toEqual(serialized)
    expect(user2.toObject()).toEqual(serialized)
  })
})
