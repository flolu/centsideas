import {inject, injectable} from 'inversify'
import * as faker from 'faker'

import {
  MongoEventStore,
  mongoEventStoreFactory,
  MongoEventStoreFactory,
} from '@centsideas/event-sourcing'
import {Email, Id, URL, Username, UserRole} from '@centsideas/common/types'
import {Config} from '@centsideas/config'
import {EventDispatcher, EventListener} from '@centsideas/messaging'
import {DomainEvents, Environments, RpcStatus} from '@centsideas/common/enums'
import {MailingAdapter, UserReadAdapter} from '@centsideas/adapters'
import {UserDeleted, UserRegistered} from '@centsideas/schema'

import {PrivateUser} from '../private-user'
import {User} from '../user'
import {Bio} from '../bio'
import {Location} from '../location'
import {DisplayName} from '../display-name'
import {EmailChangeToken} from '../email-change.token'
import {UserDeletionToken} from '../user-deletion.token'

interface UpdateProfileOptions {
  avatar?: string
  name?: string
  bio?: string
  location?: string
  website?: string
  email?: string
}

@injectable()
export class UserService {
  private readonly emailChangeTokenSecret = this.config.get('secrets.tokens.emailChange')
  private readonly deletionTokenSecret = this.config.get('secrets.tokens.userDeletion')
  private readonly eventStoreUrl = this.config.get('eventStore.url')
  private readonly eventStoreUser = this.config.get('eventStore.user')
  private readonly eventStorePassword = this.config.get('secrets.eventStore.password')
  private readonly userDbName = this.config.get('user.eventStore.userDbName')
  private readonly privateUserDbName = this.config.get('user.eventStore.privateUserDbName')
  private readonly userSnapshotThreshold = this.config.getNumber(
    'user.eventStore.userSnapshotThreshold',
  )
  private readonly privateUserSnapshotThreshold = this.config.getNumber(
    'user.eventStore.privateUserSnapshotThreshold',
  )
  private readonly environment = this.config.get('environment')

  userEventStore: MongoEventStore<User> = this.eventStoreFactory(
    this.eventStoreUrl,
    this.userDbName,
    {
      user: this.eventStoreUser,
      password: this.eventStorePassword,
    },
  )
  privateUserEventStore: MongoEventStore<PrivateUser> = this.eventStoreFactory(
    this.eventStoreUrl,
    this.privateUserDbName,
    {
      user: this.eventStoreUser,
      password: this.eventStorePassword,
    },
  )

  constructor(
    private readonly config: Config,
    private readonly eventListener: EventListener,
    private readonly eventDispatcher: EventDispatcher,
    private readonly userReadAdapter: UserReadAdapter,
    private readonly mailingAdapter: MailingAdapter,
    @inject(mongoEventStoreFactory) private eventStoreFactory: MongoEventStoreFactory,
  ) {
    this.consumeDomainEvents()
    this.userEventStore.setDefaultSnapshotThreshold(this.userSnapshotThreshold)
    this.privateUserEventStore.setDefaultSnapshotThreshold(this.privateUserSnapshotThreshold)
  }

  async rename(id: Id, username: Username) {
    const user = await this.userEventStore.loadAggregate(id, User)
    user.rename(username)
    await this.userEventStore.store(user)
  }

  async changeRole(id: Id, role: UserRole) {
    const user = await this.userEventStore.loadAggregate(id, User)
    user.changeRole(role)
    await this.userEventStore.store(user)
  }

  async updateProfile(id: Id, options: UpdateProfileOptions) {
    const privateUser = await this.privateUserEventStore.loadAggregate(id, PrivateUser)
    if (options.avatar) privateUser.changeAvatar(URL.fromString(options.avatar))
    if (options.bio) privateUser.updateBio(Bio.fromString(options.bio))
    if (options.email) privateUser.requestEmailChange(Email.fromString(options.email))
    if (options.location) privateUser.changeLocation(Location.fromString(options.location))
    if (options.name) privateUser.changeDisplayName(DisplayName.fromString(options.name))
    if (options.website) privateUser.changeWebsite(URL.fromString(options.website))
    await this.privateUserEventStore.store(privateUser)

    const pendingEmail = privateUser.getPendingEmail()
    if (pendingEmail) {
      const token = new EmailChangeToken(id, privateUser.getEmail(), pendingEmail)
      const str = token.sign(this.emailChangeTokenSecret)

      await this.mailingAdapter.send(pendingEmail, 'Change Your EMail', str)
      if (this.environment === Environments.UnitTesting) return str
    }
  }

  async confirmEmailChange(emailChangeToken: string) {
    const token = EmailChangeToken.fromString(emailChangeToken, this.emailChangeTokenSecret)
    const privateUser = await this.privateUserEventStore.loadAggregate(token.userId, PrivateUser)
    privateUser.confirmEmailChange()
    await this.privateUserEventStore.store(privateUser)
  }

  async requestDeletion(id: Id) {
    const [user, privateUser] = await Promise.all([
      this.userEventStore.loadAggregate(id, User),
      this.privateUserEventStore.loadAggregate(id, PrivateUser),
    ])
    user.requestDeletion()
    await this.userEventStore.store(user)

    const token = new UserDeletionToken(id)
    const str = token.sign(this.deletionTokenSecret)

    await this.mailingAdapter.send(privateUser.getEmail(), 'Delete Your Account', str)
    if (this.environment === Environments.UnitTesting) return str
  }

  async confirmDeletion(deletionToken: string) {
    const token = UserDeletionToken.fromString(deletionToken, this.deletionTokenSecret)
    const [user, privateUser] = await Promise.all([
      this.userEventStore.loadAggregate(token.userId, User),
      this.privateUserEventStore.loadAggregate(token.userId, PrivateUser),
    ])
    user.confirmDeletion()
    privateUser.delete()

    await Promise.all([
      this.userEventStore.store(user),
      this.privateUserEventStore.store(privateUser),
    ])

    await this.publishUserDeleted(user.aggregateId)

    await this.mailingAdapter.send(
      privateUser.getEmail(),
      'You Are Gone Now :(',
      'Your account has been deleted. Good bye.',
    )
  }

  isHealthy() {
    return (
      this.userEventStore.isHealthy() &&
      this.eventListener.isConnected() &&
      this.eventDispatcher.isConnected()
    )
  }

  private async publishUserDeleted(userId: Id) {
    const message: UserDeleted = {userId: userId.toString()}
    await this.eventDispatcher.dispatch(DomainEvents.UserDeleted, [
      {
        key: userId.toString(),
        value: JSON.stringify(message),
      },
    ])
  }

  private async consumeDomainEvents() {
    const registrationListener = await this.eventListener.consume(
      'user.registration',
      DomainEvents.UserRegistered,
    )
    registrationListener.subscribe(async ({message}) => {
      const decoded: UserRegistered = JSON.parse(message.value!.toString())
      await this.create(Id.fromString(decoded.userId), Email.fromString(decoded.email))
    })

    const deletionListener = await this.eventListener.consume(
      'user.deletion',
      DomainEvents.UserDeleted,
    )
    deletionListener.subscribe(async ({message}) => {
      const decoded: UserDeleted = JSON.parse(message.value!.toString())
      await this.delete(Id.fromString(decoded.userId))
    })
  }

  private async create(id: Id, email: Email) {
    const username = await this.generateUsername(email)
    const user = User.create(id, username)
    const privateUser = PrivateUser.create(id, email)

    await Promise.all([
      this.userEventStore.store(user),
      this.privateUserEventStore.store(privateUser),
    ])
  }

  private async delete(id: Id) {
    await this.privateUserEventStore.deleteStream(id)
  }

  private async generateUsername(email: Email) {
    let username: Username | undefined
    let usernameTry: Username | undefined
    try {
      usernameTry = Username.fromString(email.toString().split('@').shift() as string)
      username = (await this.isUsernameAvailable(usernameTry)) ? usernameTry : undefined
    } catch (err) {
      //
    }

    if (!username) {
      usernameTry = Username.fromString(faker.internet.userName())
      username = (await this.isUsernameAvailable(usernameTry)) ? usernameTry : undefined
    }

    if (!username) throw new Error('Username could not be generated.')

    return username
  }

  private async isUsernameAvailable(username: Username) {
    try {
      const existing = await this.userReadAdapter.getByUsername(username.toString())
      return !existing
    } catch (err) {
      if (err.code === RpcStatus.NOT_FOUND) return true
      return false
    }
  }
}
