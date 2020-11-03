import {injectable} from 'inversify'

import {Email, Id, Timestamp, Username} from '@centsideas/common/types'
import {FullUserReadState} from '@centsideas/schema'

import {PrivateUserProjector, PrivateUserReadState} from './private-user.projector'
import {UserProjector, UserReadState} from './user.projector'
import {UserNotFound} from './user-read.errors'

@injectable()
export class UserReadService {
  constructor(
    private readonly userProjector: UserProjector,
    private readonly privateUserProjector: PrivateUserProjector,
  ) {}

  async getByEmail(emailString: string, auid?: string) {
    const email = Email.fromString(emailString)
    const privateUser = await this.privateUserProjector.getByEmail(email)
    if (!privateUser) throw new UserNotFound({email})
    const id = Id.fromString(privateUser.id)
    const user = await this.userProjector.getById(id)
    return this.createReadState(user!, privateUser, auid)
  }

  async getById(idString: string, auid?: string) {
    const id = Id.fromString(idString)
    const user = await this.userProjector.getById(id)
    if (!user) throw new UserNotFound({id})
    const privateUser = await this.privateUserProjector.getById(id)
    return this.createReadState(user, privateUser!, auid)
  }

  async getByUsername(usernameString: string, auid?: string) {
    const username = Username.fromString(usernameString)
    const user = await this.userProjector.getByUsername(username)
    if (!user) throw new UserNotFound({username})
    const id = Id.fromString(user.id)
    const privateUser = await this.privateUserProjector.getById(id)
    return this.createReadState(user, privateUser!, auid)
  }

  async getAll() {
    const users = await this.userProjector.getAll()
    const privateUsers = await this.privateUserProjector.getAll()
    return users.map((user, index) => this.createReadState(user, privateUsers[index]))
  }

  private createReadState(
    user: UserReadState,
    privateUser: PrivateUserReadState,
    auid?: string,
  ): FullUserReadState {
    // FIXME find better way of doing this
    if (user.id !== privateUser.id) throw new Error("Id's of public and private user do not match.")

    const up1 = Timestamp.fromString(user.updatedAt)
    const up2 = Timestamp.fromString(privateUser.updatedAt)

    const base = {
      id: user.id,
      username: user.username,
      role: user.role,
      avatarUrl: privateUser.avatarUrl,
      displayName: privateUser.displayName,
      bio: privateUser.bio,
      location: privateUser.location,
      website: privateUser.website,
      createdAt: user.createdAt,
      updatedAt: up1.isBefore(up2) ? privateUser.updatedAt : user.updatedAt,
    }

    if (auid !== user.id) return base
    return {...base, email: privateUser.email, pendingEmail: privateUser.pendingEmail}
  }
}
