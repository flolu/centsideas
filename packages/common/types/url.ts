import * as urlRegex from 'url-regex'

import {GenericErrors, RpcStatus} from '../enums'
import {Exception} from './exception'

export class URL {
  private constructor(private url: string, strict: boolean) {
    if (!urlRegex({exact: true, strict}).test(this.url)) throw new InvalidURL(this.url)
  }

  static fromString(url: string, strict = false) {
    return new URL(url, strict)
  }

  toString() {
    return this.url
  }
}

export class InvalidURL extends Exception {
  name = GenericErrors.InvalidURL
  code = RpcStatus.INVALID_ARGUMENT

  constructor(url: string) {
    super(`${url} is not a valid URL.`)
  }
}
