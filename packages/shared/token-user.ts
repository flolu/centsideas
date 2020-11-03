import {Id, UserRole} from '@centsideas/common/types'

export interface SerializedTokenUser {
  id: string
  role: string
}

export class TokenUser {
  private constructor(public readonly id: Id, public readonly role: UserRole) {}

  static fromObject(object: SerializedTokenUser) {
    return new TokenUser(Id.fromString(object.id), UserRole.fromString(object.role))
  }

  static fromValues(id: Id | string, role: UserRole) {
    const idString = id instanceof Id ? id : Id.fromString(id)
    return new TokenUser(idString, role)
  }

  toObject(): SerializedTokenUser {
    return {
      id: this.id.toString(),
      role: this.role.toString(),
    }
  }
}
