import {Exception} from '@centsideas/common/types'
import {UserErrors, RpcStatus} from '@centsideas/common/enums'

export enum BioLength {
  Max = 177,
}

export class Bio {
  private constructor(private readonly bio: string) {
    if (this.bio.length > BioLength.Max) throw new BioTooLong(this.bio)
  }

  static fromString(bio: string) {
    return new Bio(bio)
  }

  toString() {
    return this.bio
  }
}

export class BioTooLong extends Exception {
  name = UserErrors.DisplayNameTooLong
  code = RpcStatus.INVALID_ARGUMENT

  constructor(bio: string) {
    super(`${bio} is too long. Max length is ${BioLength.Max}.`)
  }
}
