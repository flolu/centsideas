import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'
import {Request, Response, NextFunction} from 'express'

import {AccessToken} from '@centsideas/shared'

import {NotSignedIn} from './not-signed-in'

@injectable()
export class SignedInMiddleware extends BaseMiddleware {
  handler(_req: Request, res: Response, next: NextFunction) {
    const token: AccessToken = res.locals.token
    if (!token.user) return next(new NotSignedIn(token.sessionId.toString()))
    next()
  }
}
