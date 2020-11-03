import 'reflect-metadata'

import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import {Container} from 'inversify'
import {InversifyExpressServer} from 'inversify-express-utils'
import {Response, Request, NextFunction} from 'express'

import {Config} from '@centsideas/config'
import {GenericErrors, Ports, RpcStatusHttpMap, ServiceName} from '@centsideas/common/enums'
import {AuthWriteAdapter, UserReadAdapter, UserWriteAdapter} from '@centsideas/adapters'
import {ExpressLoggerMiddleware, Logger} from '@centsideas/common/helpers'

import {IndexController} from './index.controller'
import {AuthController} from './auth.controller'
import {AccessTokenMiddleware} from './access-token.middleware'
import {SignedInMiddleware} from './signed-in.middleware'
import {UserController} from './user.controller'

const container = new Container()
const server = new InversifyExpressServer(container)

container.bind(IndexController).toSelf().inSingletonScope()
container.bind(AuthController).toSelf().inSingletonScope()
container.bind(UserController).toSelf().inSingletonScope()

container.bind(UserWriteAdapter).toSelf().inSingletonScope()
container.bind(UserReadAdapter).toSelf().inSingletonScope()
container.bind(AuthWriteAdapter).toSelf().inSingletonScope()

container.bind(Config).toSelf().inSingletonScope()
container.bind(Logger).toSelf().inSingletonScope()
container.bind(AccessTokenMiddleware).toSelf()
container.bind(SignedInMiddleware).toSelf()
container.bind(ExpressLoggerMiddleware).toSelf()

const config = container.get(Config)
const environment = config.get('environment')
const isProd = environment === 'prod'

server.setConfig(app => {
  app.use(helmet())
  app.use(helmet.hidePoweredBy())
  app.use(bodyParser.json())
  app.use(cookieParser())
})

interface ErrorResponse {
  name: string
  message: string
  service?: string
  details?: object
  stack?: string
  timestamp?: string
}

server.setErrorConfig(app => {
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err.isAxiosError && err.response) {
      const {name, code, message, timestamp, details, stack, service} = err.response.data
      const response: ErrorResponse = {name, message}
      if (!isProd) {
        response.details = details
        response.service = service
        response.stack = stack
        response.timestamp = timestamp
      }
      const status = RpcStatusHttpMap[code] || 500
      res.status(status).json(response)
    } else {
      const response: ErrorResponse = {
        name: err.name || GenericErrors.Unexpected,
        message: err.message,
      }
      if (!isProd) {
        response.details = err.details
        response.service = err.service || ServiceName.Gateway
        response.stack = err.stack
      }

      const status = RpcStatusHttpMap[err.code] || 500
      res.status(status).json(response)
    }
  })
})

server.build().listen(Ports.HttpApi)
