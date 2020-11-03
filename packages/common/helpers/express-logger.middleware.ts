import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'
import {Request, Response, NextFunction} from 'express'

import {Logger} from '@centsideas/common/helpers'

@injectable()
export class ExpressLoggerMiddleware extends BaseMiddleware {
  constructor(private readonly logger: Logger) {
    super()
  }

  handler(req: Request, _res: Response, next: NextFunction) {
    if (req.path === '/' && req.method === 'GET') return next()
    this.logger.log(req.method, req.path, req.body)
    next()
  }
}
