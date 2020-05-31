import {injectable} from 'inversify';

import {Config} from '@centsideas/config';
import {Services} from '@centsideas/enums';

@injectable()
export class GatewayConfig extends Config {
  constructor() {
    super(Services.Gateway);
  }
}
