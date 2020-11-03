import {Exception} from './exception'
import {GenericErrors, RpcStatus} from '../enums'

const EMAIL_REGEX = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

export class Email {
  private constructor(private email: string) {
    if (!EMAIL_REGEX.test(this.email)) throw new InvalidEmail(this.email)
  }

  static fromString(email: string) {
    return new Email(email)
  }

  toString() {
    return this.email
  }

  equals(that: Email) {
    return this.email === that.toString()
  }
}

export class InvalidEmail extends Exception {
  name = GenericErrors.InvalidEmail
  code = RpcStatus.INVALID_ARGUMENT

  constructor(email: string) {
    super(`${email} is not a valid email adress`, {email})
  }
}
