import {Exception} from '@centsideas/common/types'
import {UserErrors, RpcStatus} from '@centsideas/common/enums'

export enum LocationLength {
  Max = 60,
}

export class Location {
  private constructor(private readonly location: string) {
    if (this.location.length > LocationLength.Max) throw new LocationTooLong(this.location)
  }

  static fromString(bio: string) {
    return new Location(bio)
  }

  toString() {
    return this.location
  }
}

export class LocationTooLong extends Exception {
  name = UserErrors.LocationTooLong
  code = RpcStatus.INVALID_ARGUMENT

  constructor(location: string) {
    super(`${location} is too long. Max length is ${LocationLength.Max}.`)
  }
}
