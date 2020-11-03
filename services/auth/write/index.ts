import 'reflect-metadata'
import {Container} from 'inversify'
import {
  controller,
  httpGet,
  httpPost,
  interfaces,
  InversifyExpressServer,
} from 'inversify-express-utils'
import {Response, Request} from 'express'
import * as bodyParser from 'body-parser'

import {
  InMemoryEventStore,
  MongoEventStore,
  mongoEventStoreFactory,
} from '@centsideas/event-sourcing'
import {Config} from '@centsideas/config'
import {EventDispatcher, EventListener} from '@centsideas/messaging'
import {MailingAdapter, UserReadAdapter} from '@centsideas/adapters'
import {AuthApi, Ports, ServiceName} from '@centsideas/common/enums'
import {AuthWrite} from '@centsideas/schema'
import {errorHandlerFactory, ExpressLoggerMiddleware, Logger} from '@centsideas/common/helpers'

import {AuthService} from './auth.service'
import {GoogleApiAdapter} from '../google-api.adapter'

const container = new Container()
container.bind(AuthService).toSelf().inSingletonScope()
container.bind(InMemoryEventStore).toSelf().inSingletonScope()
container.bind(Config).toSelf().inSingletonScope()
container.bind(EventDispatcher).toSelf()
container.bind(GoogleApiAdapter).toSelf().inSingletonScope()
container.bind(EventListener).toSelf().inSingletonScope()
container.bind(UserReadAdapter).toSelf().inSingletonScope()
container.bind(mongoEventStoreFactory).toFactory(mongoEventStoreFactory)
container.bind(MongoEventStore).toSelf()
container.bind(Logger).toSelf().inSingletonScope()
container.bind(ExpressLoggerMiddleware).toSelf()
container.bind(MailingAdapter).toSelf().inSingletonScope()

@controller('', ExpressLoggerMiddleware)
export class AuthServer implements interfaces.Controller {
  constructor(private readonly authService: AuthService) {}

  @httpPost(`/${String(AuthApi.RequestEmailSignIn)}`)
  async requestEmailSignIn(req: Request) {
    const {email, sessionId} = req.body as AuthWrite.RequestEmailSignIn
    await this.authService.requestEmailSignIn(email, sessionId)
  }

  @httpPost(`/${String(AuthApi.ConfirmEmailSignIn)}`)
  async confirmEmailSignIn(req: Request): Promise<AuthWrite.Tokens> {
    const {token} = req.body as AuthWrite.ConfirmEmailSignIn
    return this.authService.confirmEmailSignIn(token)
  }

  @httpPost(`/${String(AuthApi.GoogleSignIn)}`)
  async googleSignIn(req: Request): Promise<AuthWrite.Tokens> {
    const {code, sessionId} = req.body as AuthWrite.GoogleSignIn
    return this.authService.handleGoogleSignIn(code, sessionId)
  }

  @httpPost(`/${String(AuthApi.RefreshTokens)}`)
  async refreshTokens(req: Request): Promise<AuthWrite.Tokens> {
    const {token} = req.body as AuthWrite.RefreshTokens
    return this.authService.refreshTokens(token)
  }

  @httpPost(`/${String(AuthApi.SignOut)}`)
  async signOut(req: Request): Promise<AuthWrite.Tokens> {
    const {sessionId} = req.body as AuthWrite.SignOut
    return this.authService.signOut(sessionId)
  }

  @httpGet('')
  async health(_req: Request, res: Response) {
    if (this.authService.isHealthy()) return res.status(200).send()
    res.status(500).send()
  }
}

container.bind(AuthServer).toSelf()

const server = new InversifyExpressServer(container)
server.setConfig(app => app.use(bodyParser.json()))
server.setErrorConfig(app => app.use(errorHandlerFactory(ServiceName.AuthWrite)))
server.build().listen(Ports.HttpApi)
