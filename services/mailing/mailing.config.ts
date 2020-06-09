import {injectable} from 'inversify';

import {Config} from '@centsideas/config';

@injectable()
export class MailingConfig extends Config {
  constructor() {
    super('mailing');
  }
}
