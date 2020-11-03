import {controller, interfaces, httpGet} from 'inversify-express-utils'

@controller('')
export class IndexController implements interfaces.Controller {
  @httpGet('')
  async index() {
    return 'centsideas gateway\n'
  }
}
