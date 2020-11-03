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

import {
  InMemoryEventStore,
  MongoEventStore,
  mongoEventStoreFactory,
} from '@centsideas/event-sourcing'
import {Config} from '@centsideas/config'
import {EventDispatcher, EventListener} from '@centsideas/messaging'
import {MailingAdapter, UserReadAdapter} from '@centsideas/adapters'
import {Ports, ServiceName, UserApi} from '@centsideas/common/enums'
import {UserWrite} from '@centsideas/schema'
import {Id, Username} from '@centsideas/common/types'
import {errorHandlerFactory, ExpressLoggerMiddleware, Logger} from '@centsideas/common/helpers'

import {UserService} from './user.service'

const container = new Container()
container.bind(UserService).toSelf().inSingletonScope()
container.bind(InMemoryEventStore).toSelf()
container.bind(Config).toSelf().inSingletonScope()
container.bind(EventDispatcher).toSelf()
container.bind(mongoEventStoreFactory).toFactory(mongoEventStoreFactory)
container.bind(MongoEventStore).toSelf()
container.bind(EventListener).toSelf().inSingletonScope()
container.bind(UserReadAdapter).toSelf().inSingletonScope()
container.bind(Logger).toSelf().inSingletonScope()
container.bind(ExpressLoggerMiddleware).toSelf()
container.bind(MailingAdapter).toSelf().inSingletonScope()

@controller('', ExpressLoggerMiddleware)
export class UserServer implements interfaces.Controller {
  constructor(private readonly userService: UserService) {}

  @httpPost(`/${String(UserApi.Rename)}`)
  async rename(req: Request) {
    const {id, username} = req.body as UserWrite.Rename
    await this.userService.rename(Id.fromString(id), Username.fromString(username))
  }

  @httpPost(`/${String(UserApi.UpdateProfile)}`)
  async updateProfile(req: Request) {
    const {id, avatar, bio, name, location, website, email} = req.body as UserWrite.UpdateProfile
    const options = {avatar, bio, name, location, website, email}
    await this.userService.updateProfile(Id.fromString(id), options)
  }

  @httpPost(`/${String(UserApi.ConfirmEmailChange)}`)
  async confirmEmailChange(req: Request) {
    const {token} = req.body as UserWrite.ConfirmEmail
    await this.userService.confirmEmailChange(token)
  }

  @httpPost(`/${String(UserApi.RequestDeletion)}`)
  async requestDeletion(req: Request) {
    const {id} = req.body as UserWrite.RequestDeletion
    await this.userService.requestDeletion(Id.fromString(id))
  }

  @httpPost(`/${String(UserApi.Rename)}`)
  async confirmDeletion(req: Request) {
    const {token} = req.body as UserWrite.ConfirmDeletion
    await this.userService.confirmDeletion(token)
  }

  @httpPost(`/${String(UserApi.GetPrivateEvents)}`)
  async getPrivateEvents(req: Request) {
    const {from} = req.body as UserWrite.GetEvents
    const events = await this.userService.privateUserEventStore.getEvents(from)
    return events.map(e => e.serialize())
  }

  @httpPost(`/${String(UserApi.GetPublicEvents)}`)
  async getPublicEvents(req: Request) {
    const {from} = req.body as UserWrite.GetEvents
    const events = await this.userService.userEventStore.getEvents(from)
    return events.map(e => e.serialize())
  }

  @httpGet('')
  async health(_req: Request, res: Response) {
    if (this.userService.isHealthy()) return res.status(200).send()
    res.status(500).send()
  }
}

container.bind(UserServer).toSelf()

const server = new InversifyExpressServer(container)
server.setConfig(app => app.use(bodyParser.json()))
server.setErrorConfig(app => app.use(errorHandlerFactory(ServiceName.UserWrite)))
server.build().listen(Ports.HttpApi)
