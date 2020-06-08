import * as sanitize from 'sanitize-html';

import {Exception} from '@centsideas/utils';
import {RpcStatus, GenericErrorNames} from '@centsideas/enums';

const EMAIL_REGEX = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

export class Email {
  private constructor(private email: string) {
    this.email = sanitize(this.email);
    if (!EMAIL_REGEX.test(this.email)) throw new InvalidEmail(this.email);
  }

  static fromString(email: string) {
    return new Email(email);
  }

  toString() {
    return this.email;
  }
}

class InvalidEmail extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = GenericErrorNames.InvalidEmail;

  constructor(email: string) {
    super(`${email} is not a valid email adress`);
  }
}
