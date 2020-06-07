import {injectable} from 'inversify';

import {Config} from '@centsideas/config';

@injectable()
export class AuthenticationConfig extends Config {
  constructor() {
    super('authentication');
  }
}
