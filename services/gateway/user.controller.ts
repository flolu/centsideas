import {controller, httpGet, httpPost, interfaces} from 'inversify-express-utils'
import {Request, Response} from 'express'

import {AccessToken} from '@centsideas/shared'
import {UserReadAdapter, UserWriteAdapter} from '@centsideas/adapters'

import {AccessTokenMiddleware} from './access-token.middleware'
import {SignedInMiddleware} from './signed-in.middleware'

@controller('/user', AccessTokenMiddleware, SignedInMiddleware)
export class UserController implements interfaces.Controller {
  constructor(
    private readonly writeAdapter: UserWriteAdapter,
    private readonly readAdapter: UserReadAdapter,
  ) {}

  @httpPost('/rename')
  async rename(req: Request, res: Response) {
    const {username} = req.body
    const id = (res.locals.token as AccessToken).user!.id
    await this.writeAdapter.rename(id, username)
  }

  @httpPost('/updateProfile')
  async updateProfile(req: Request, res: Response) {
    const {avatar, name, bio, location, website, email} = req.body
    const id = (res.locals.token as AccessToken).user!.id
    await this.writeAdapter.updateProfile(id, {avatar, name, bio, location, website, email})
  }

  @httpPost('/email/confirm')
  async confirmEmail(req: Request) {
    const {token} = req.body
    await this.writeAdapter.confirmEmail(token)
  }

  @httpPost('/deletion/request')
  async requestDeletion(_req: Request, res: Response) {
    const id = (res.locals.token as AccessToken).user!.id
    await this.writeAdapter.requestDeletion(id)
  }

  @httpPost('/deletion/confirm')
  async confirmDeletion(req: Request) {
    const {token} = req.body
    await this.writeAdapter.confirmDeletion(token)
  }

  @httpGet('/me', SignedInMiddleware)
  getMe(_req: Request, res: Response) {
    const id = (res.locals.token as AccessToken).user!.id
    return this.readAdapter.getById(id)
  }

  @httpGet('/:username')
  async getByUsername(req: Request, res: Response) {
    const {username} = req.params
    const id = (res.locals.token as AccessToken).user!.id
    const user = await this.readAdapter.getByUsername(username, id)
    if (user) return user
    res.status(404).send()
  }

  @httpGet('/')
  getAll() {
    return this.readAdapter.getAll()
  }
}
