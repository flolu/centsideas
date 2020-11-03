import {inject, injectable} from 'inversify'

import {AccessToken, RefreshToken, TokenUser} from '@centsideas/shared'
import {Id, Email, UserRole} from '@centsideas/common/types'
import {
  MongoEventStore,
  MongoEventStoreFactory,
  mongoEventStoreFactory,
} from '@centsideas/event-sourcing'
import {Config} from '@centsideas/config'
import {EventDispatcher} from '@centsideas/messaging'
import {UserReadAdapter, MailingAdapter} from '@centsideas/adapters'
import {DomainEvents, Environments} from '@centsideas/common/enums'
import {UserRegistered} from '@centsideas/schema'

import {Session} from '../session'
import {GoogleApiAdapter} from '../google-api.adapter'
import {EmailSignInToken} from '../email-sign-in.token'

@injectable()
export class AuthService {
  private readonly accessTokenSecret = this.config.get('secrets.tokens.access')
  private readonly emailSignInTokenSecret = this.config.get('secrets.tokens.emailSignIn')
  private readonly refreshTokenSecret = this.config.get('secrets.tokens.refresh')
  private readonly eventStoreUrl = this.config.get('eventStore.url')
  private readonly eventStoreUser = this.config.get('eventStore.user')
  private readonly eventStorePassword = this.config.get('secrets.eventStore.password')
  private readonly sessionDbName = this.config.get('auth.eventStore.sessionDbName')
  private readonly snapshotThreshold = this.config.getNumber(
    'auth.eventStore.sessionSnapshotThreshold',
  )
  private readonly environment = this.config.get('environment')

  private sessionEventStore: MongoEventStore<Session> = this.eventStoreFactory(
    this.eventStoreUrl,
    this.sessionDbName,
    {
      user: this.eventStoreUser,
      password: this.eventStorePassword,
    },
  )

  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private readonly googleApiAdapter: GoogleApiAdapter,
    private readonly userReadAdapter: UserReadAdapter,
    private readonly config: Config,
    private readonly mailingAdapter: MailingAdapter,
    @inject(mongoEventStoreFactory) private eventStoreFactory: MongoEventStoreFactory,
  ) {
    this.sessionEventStore.setDefaultSnapshotThreshold(this.snapshotThreshold)
  }

  async requestEmailSignIn(emailString: string, sessionIdString: string) {
    const email = Email.fromString(emailString)
    const sessionId = Id.fromString(sessionIdString)
    const session = await this.sessionEventStore.loadAggregate(sessionId, Session)

    session.requestEmailSignIn()
    await this.sessionEventStore.store(session)

    const token = new EmailSignInToken(email, sessionId)
    const str = token.sign(this.emailSignInTokenSecret)

    await this.mailingAdapter.send(email, 'Verify Your Sign In', str)
    if (this.environment === Environments.UnitTesting) return str
  }

  async confirmEmailSignIn(emailSignInTokenString: string) {
    const {sessionId, email} = EmailSignInToken.fromString(
      emailSignInTokenString,
      this.emailSignInTokenSecret,
    )
    const [session, existingUser] = await Promise.all([
      this.sessionEventStore.loadAggregate(sessionId, Session),
      this.userReadAdapter.getByEmail(email),
    ])
    const userId = existingUser ? Id.fromString(existingUser.id) : Id.generate()

    session.confirmEmailSignIn(userId)
    await this.sessionEventStore.store(session)

    if (!existingUser) await this.publishUserRegistered(userId, email, sessionId)

    const role = existingUser ? UserRole.fromString(existingUser.role) : UserRole.Basic()
    return this.createTokens(
      sessionId,
      session.currentState.tokenRefreshCount,
      TokenUser.fromValues(userId, role),
    )
  }

  async handleGoogleSignIn(code: string, sessionIdString: string) {
    const sessionId = Id.fromString(sessionIdString)
    const googleAccessToken = await this.googleApiAdapter.getAccessToken(code)
    const email = await this.googleApiAdapter.getUserInfo(googleAccessToken)

    const existingUser = await this.userReadAdapter.getByEmail(email)
    const userId = existingUser ? Id.fromString(existingUser.id) : Id.generate()

    if (!existingUser) await this.publishUserRegistered(userId, email, sessionId)

    const session = await this.sessionEventStore.loadAggregate(sessionId, Session)
    session.confirmGoogleSignIn(userId)
    await this.sessionEventStore.store(session)

    const role = existingUser ? UserRole.fromString(existingUser.role) : UserRole.Basic()
    return this.createTokens(
      sessionId,
      session.currentState.tokenRefreshCount,
      TokenUser.fromValues(userId, role),
    )
  }

  async refreshTokens(currentRefreshTokenString: string) {
    try {
      const currentRefreshToken = RefreshToken.fromString(
        currentRefreshTokenString,
        this.refreshTokenSecret,
      )
      const {sessionId} = currentRefreshToken

      let user: TokenUser | undefined
      if (currentRefreshToken.user) {
        const userRead = await this.userReadAdapter.getById(currentRefreshToken.user.id)
        user = TokenUser.fromValues(Id.fromString(userRead.id), UserRole.fromString(userRead.role))
      }

      const session = await this.sessionEventStore.loadAggregate(sessionId, Session)
      session.refreshTokens(currentRefreshToken)
      await this.sessionEventStore.store(session)

      return this.createTokens(sessionId, session.currentState.tokenRefreshCount, user)
    } catch (err) {
      return this.startSession()
    }
  }

  async signOut(sessionIdString: string) {
    const sessionId = Id.fromString(sessionIdString)
    const session = await this.sessionEventStore.loadAggregate(sessionId, Session)
    session.signOut()
    await this.sessionEventStore.store(session)

    return this.createTokens(sessionId, session.currentState.tokenRefreshCount)
  }

  isHealthy() {
    return this.sessionEventStore.isHealthy() && this.eventDispatcher.isConnected()
  }

  private createTokens(session: Id, tokenRefreshCount: number, user?: TokenUser) {
    const accessToken = new AccessToken(session, user)
    const refreshToken = new RefreshToken(session, tokenRefreshCount, user)

    return {
      accessToken: accessToken.sign(this.accessTokenSecret),
      refreshToken: refreshToken.sign(this.refreshTokenSecret),
    }
  }

  private async startSession() {
    const id = Id.generate()
    const session = Session.start(id)
    await this.sessionEventStore.store(session)

    const accessToken = new AccessToken(id)
    const refreshToken = new RefreshToken(id, session.currentState.tokenRefreshCount)
    return {
      accessToken: accessToken.sign(this.accessTokenSecret),
      refreshToken: refreshToken.sign(this.refreshTokenSecret),
    }
  }

  private async publishUserRegistered(userId: Id, email: Email, sessionId: Id) {
    const message: UserRegistered = {userId: userId.toString(), email: email.toString()}
    await this.eventDispatcher.dispatch(DomainEvents.UserRegistered, [
      {
        key: sessionId.toString(),
        value: JSON.stringify(message),
      },
    ])
  }
}
