import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import {Container} from 'inversify'
import {
  controller,
  httpGet,
  httpPost,
  interfaces,
  InversifyExpressServer,
} from 'inversify-express-utils'
import {Request, Response} from 'express'

import {EventListener} from '@centsideas/messaging'
import {Config} from '@centsideas/config'
import {Ports, ServiceName, UserReadApi} from '@centsideas/common/enums'
import {UserRead} from '@centsideas/schema'
import {UserWriteAdapter} from '@centsideas/adapters'
import {errorHandlerFactory, ExpressLoggerMiddleware, Logger} from '@centsideas/common/helpers'

import {UserReadService} from './user-read.service'
import {UserProjector} from './user.projector'
import {PrivateUserProjector} from './private-user.projector'

const container = new Container()
container.bind(EventListener).toSelf().inSingletonScope()
container.bind(Config).toSelf().inSingletonScope()
container.bind(Logger).toSelf().inSingletonScope()
container.bind(ExpressLoggerMiddleware).toSelf()

container.bind(UserReadService).toSelf().inSingletonScope()
container.bind(UserProjector).toSelf().inSingletonScope()
container.bind(PrivateUserProjector).toSelf().inSingletonScope()
container.bind(UserWriteAdapter).toSelf().inSingletonScope()

@controller('', ExpressLoggerMiddleware)
export class UserReadServer implements interfaces.Controller {
  constructor(
    private readonly userProjector: UserProjector,
    private readonly privateUserProjector: PrivateUserProjector,
    private readonly userReadService: UserReadService,
  ) {}

  @httpPost(`/${String(UserReadApi.GetByEmail)}`)
  async getByEmail(req: Request) {
    const {email, auid} = req.body as UserRead.GetByEmail
    return this.userReadService.getByEmail(email, auid)
  }

  @httpPost(`/${String(UserReadApi.GetMe)}`)
  async getMe(req: Request) {
    const {id} = req.body as UserRead.GetMe
    return this.userReadService.getById(id, id)
  }

  @httpPost(`/${String(UserReadApi.GetByUsername)}`)
  async getByUsername(req: Request) {
    const {username, auid} = req.body as UserRead.GetByUsername
    return this.userReadService.getByUsername(username, auid)
  }

  @httpPost(`/${String(UserReadApi.GetAll)}`)
  async getAll() {
    return this.userReadService.getAll()
  }

  @httpGet('')
  async health(_req: Request, res: Response) {
    if (this.userProjector.isHealthy() && this.privateUserProjector.isHealthy())
      return res.status(200).send()
    res.status(500).send()
  }
}

container.bind(UserReadServer).toSelf()

const server = new InversifyExpressServer(container)
server.setConfig(app => app.use(bodyParser.json()))
server.setErrorConfig(app => app.use(errorHandlerFactory(ServiceName.UserRead)))
server.build().listen(Ports.HttpApi)
