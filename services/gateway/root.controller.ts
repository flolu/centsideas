import {interfaces, controller, httpGet} from 'inversify-express-utils';

import {ApiEndpoints} from '@centsideas/enums';

@controller('')
export class RootController implements interfaces.Controller {
  @httpGet(``)
  index() {
    return 'centsideas api gateway';
  }

  @httpGet(`/${ApiEndpoints.Alive}`)
  alive() {
    return 'gateway is alive';
  }
}
