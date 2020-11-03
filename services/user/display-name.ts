import {Exception} from '@centsideas/common/types'
import {UserErrors, RpcStatus} from '@centsideas/common/enums'

export enum DisplayNameLength {
  Max = 30,
}

export class DisplayName {
  private constructor(private readonly name: string) {
    if (this.name.length > DisplayNameLength.Max) throw new DisplayNameTooLong(this.name)
  }

  static fromString(name: string) {
    return new DisplayName(name)
  }

  toString() {
    return this.name
  }
}

export class DisplayNameTooLong extends Exception {
  name = UserErrors.DisplayNameTooLong
  code = RpcStatus.INVALID_ARGUMENT

  constructor(name: string) {
    super(`${name} is too long. Max length is ${DisplayNameLength.Max}.`)
  }
}
