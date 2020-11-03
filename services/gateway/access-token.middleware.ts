import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'
import {Request, Response, NextFunction} from 'express'

import {AccessToken} from '@centsideas/shared'
import {Config} from '@centsideas/config'

@injectable()
export class AccessTokenMiddleware extends BaseMiddleware {
  private readonly accessTokenSecret = this.config.get('secrets.tokens.access')

  constructor(private readonly config: Config) {
    super()
  }

  handler(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization
      const tokenString = header ? header.split(' ')[1] : ''
      const token = AccessToken.fromString(tokenString, this.accessTokenSecret)
      res.locals.token = token
      next()
    } catch (err) {
      next(err)
    }
  }
}
