import {controller, interfaces, httpPost, httpGet} from 'inversify-express-utils'
import {Request, Response, CookieOptions} from 'express'

import {AccessToken} from '@centsideas/shared'
import {TokenExpiration, CookieNames} from '@centsideas/common/enums'
import {Config} from '@centsideas/config'
import {AuthWriteAdapter} from '@centsideas/adapters'
import {ExpressLoggerMiddleware} from '@centsideas/common/helpers'

import {AccessTokenMiddleware} from './access-token.middleware'
import {SignedInMiddleware} from './signed-in.middleware'

@controller('/auth')
export class AuthController implements interfaces.Controller {
  private readonly isProd = this.config.get('environment') === 'prod'

  constructor(private readonly config: Config, private readonly writeAdapter: AuthWriteAdapter) {}

  @httpPost('/refresh', ExpressLoggerMiddleware)
  async refreshTokens(req: Request, res: Response) {
    try {
      const current = req.cookies[CookieNames.RefreshToken]
      const {accessToken, refreshToken} = await this.writeAdapter.refresh(current)
      res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions)
      return {accessToken}
    } catch (err) {
      res.cookie(CookieNames.RefreshToken, '', {maxAge: 0}).status(401)
      throw err
    }
  }

  @httpPost('/signin/email', AccessTokenMiddleware)
  async requestEmailSignIn(req: Request, res: Response) {
    const {email} = req.body
    const sessionId = (res.locals.token as AccessToken).sessionId
    await this.writeAdapter.requestEmailSignIn(email, sessionId)
  }

  @httpPost('/signin/confirm-email', AccessTokenMiddleware)
  async confirmEmailSignIn(req: Request, res: Response) {
    const {token} = req.body
    const {accessToken, refreshToken} = await this.writeAdapter.confirmEmailSignIn(token)
    res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions)
    return {accessToken}
  }

  @httpPost('/signin/google', AccessTokenMiddleware)
  async googleSignIn(req: Request, res: Response) {
    const {code} = req.body
    const sessionId = (res.locals.token as AccessToken).sessionId
    const {accessToken, refreshToken} = await this.writeAdapter.googleSignIn(code, sessionId)
    res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions)
    return {accessToken}
  }

  @httpGet('/signin/google/token')
  googleSignInToken(req: Request) {
    return req.query.code as string
  }

  @httpPost('/signout', AccessTokenMiddleware, SignedInMiddleware)
  async signOut(_req: Request, res: Response) {
    const sessionId = (res.locals.token as AccessToken).sessionId
    const {accessToken, refreshToken} = await this.writeAdapter.signOut(sessionId)
    res.cookie(CookieNames.RefreshToken, refreshToken, this.refreshTokenCookieOptions)
    return {accessToken}
  }

  private get refreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      maxAge: TokenExpiration.Refresh * 1000,
      sameSite: this.isProd ? 'strict' : 'lax',
      secure: this.isProd ? true : false,
      path: '/auth/refresh',
    }
  }
}
