import 'reflect-metadata'

import {Container} from 'inversify'

import {MailingAdapter, UserReadAdapter} from '@centsideas/adapters'
import {MailingAdapterMock, UserReadAdapterMock, userReadMocks} from '@centsideas/adapters/testing'
import {
  EventDispatcher,
  EventDispatcherMock,
  EventListenerMock,
  MockEmitter,
} from '@centsideas/messaging'
import {Config} from '@centsideas/config'
import {
  InMemoryEventStore,
  mongoEventStoreFactory,
  mongoEventStoreFactoryMock,
} from '@centsideas/event-sourcing'
import {DomainEvents, Environments} from '@centsideas/common/enums'
import {AccessToken} from '@centsideas/shared'
import {UserRegistered} from '@centsideas/schema'

import {GoogleApiAdapter} from '../google-api.adapter'
import {GoogleApiAdapterMock} from '../testing/google-api.adapter.mock'
import {AuthService} from './auth.service'

describe('auth service', () => {
  const container = new Container({skipBaseClassChecks: true})
  container.bind(Config).toSelf().inSingletonScope()

  container
    .bind(EventDispatcher)
    .to(EventDispatcherMock as any)
    .inSingletonScope()
  container.bind(MockEmitter).toSelf().inSingletonScope()
  container
    .bind(GoogleApiAdapter)
    .to(GoogleApiAdapterMock as any)
    .inSingletonScope()
  container
    .bind(UserReadAdapter)
    .to(UserReadAdapterMock as any)
    .inSingletonScope()
  container
    .bind(MailingAdapter)
    .to(MailingAdapterMock as any)
    .inSingletonScope()
  container.bind(mongoEventStoreFactory).toFactory(mongoEventStoreFactoryMock)
  container.bind(InMemoryEventStore).toSelf()
  container.bind(AuthService).toSelf().inSingletonScope()
  container.bind(EventListenerMock).toSelf().inSingletonScope()

  const config = container.get(Config)
  const accessTokenSecret = 'accessTokenSecret'
  const sessionSnapshotThreshold = 3
  config.override('environment', Environments.UnitTesting)
  config.override('secrets.tokens.access', accessTokenSecret)
  config.override('secrets.tokens.emailSignIn', '-')
  config.override('secrets.tokens.refresh', '-')
  config.override('eventStore.url', '-')
  config.override('eventStore.user', '-')
  config.override('secrets.eventStore.password', '-')
  config.override('auth.eventStore.sessionDbName', '-')
  config.override('auth.eventStore.sessionSnapshotThreshold', sessionSnapshotThreshold)

  const service = container.get(AuthService)
  const listener = container.get(EventListenerMock)

  it('signs in via email for new users', async () => {
    const userRegisteredListener = await listener.consume('', DomainEvents.UserRegistered)
    let userRegisteredEvent: UserRegistered
    userRegisteredListener.subscribe(
      data => (userRegisteredEvent = JSON.parse(data.message.value!.toString())),
    )

    const tokens1 = await service.refreshTokens('')
    const accessToken1 = AccessToken.fromString(tokens1.accessToken, accessTokenSecret)
    expect(tokens1.accessToken).toBeDefined()
    expect(tokens1.refreshToken).toBeDefined()
    expect(accessToken1.user).toEqual(undefined)

    const emailToken = await service.requestEmailSignIn(
      userReadMocks.email3.toString(),
      accessToken1.sessionId.toString(),
    )

    const tokens2 = await service.confirmEmailSignIn(emailToken!)
    const accessToken2 = AccessToken.fromString(tokens2.accessToken, accessTokenSecret)
    expect(tokens2.accessToken).toBeDefined()
    expect(tokens2.refreshToken).toBeDefined()
    expect(accessToken2.user).not.toEqual(undefined)

    const tokens3 = await service.refreshTokens(tokens2.refreshToken)
    const accessToken3 = AccessToken.fromString(tokens3.accessToken, accessTokenSecret)
    expect(tokens3.accessToken).toBeDefined()
    expect(tokens3.refreshToken).toBeDefined()
    expect(accessToken3.sessionId.equals(accessToken2.sessionId)).toBeTrue()
    expect(accessToken3.user!.id.equals(accessToken2.user!.id)).toBeTrue()

    expect(userRegisteredEvent!).toEqual({
      userId: accessToken3.user!.id.toString(),
      email: userReadMocks.email3.toString(),
    })

    await listener.disconnectAll()
  })

  it('signs in via email for existing users', async () => {
    const userRegisteredListener = await listener.consume('', DomainEvents.UserRegistered)
    let userRegisteredEvent: UserRegistered
    userRegisteredListener.subscribe(
      data => (userRegisteredEvent = JSON.parse(data.message.value!.toString())),
    )

    const tokens1 = await service.refreshTokens('')
    const accessToken1 = AccessToken.fromString(tokens1.accessToken, accessTokenSecret)
    const emailToken = await service.requestEmailSignIn(
      userReadMocks.fakeUser1.email!.toString(),
      accessToken1.sessionId.toString(),
    )
    const tokens2 = await service.confirmEmailSignIn(emailToken!)
    const accessToken2 = AccessToken.fromString(tokens2.accessToken, accessTokenSecret)

    expect(tokens2.accessToken).toBeDefined()
    expect(tokens2.refreshToken).toBeDefined()
    expect(accessToken2.user!.id.equals(userReadMocks.id1)).toBeTrue()
    expect(accessToken2.sessionId.equals(accessToken1.sessionId)).toBeTrue()

    expect(userRegisteredEvent!).toBeUndefined()
  })

  it('signs in via google', async () => {
    const tokens1 = await service.refreshTokens('')
    const accessToken1 = AccessToken.fromString(tokens1.accessToken, accessTokenSecret)

    const tokens2 = await service.handleGoogleSignIn('', accessToken1.sessionId.toString())
    const accessToken2 = AccessToken.fromString(tokens2.accessToken, accessTokenSecret)

    expect(tokens2.accessToken).toBeDefined()
    expect(tokens2.refreshToken).toBeDefined()
    expect(accessToken2.sessionId.equals(accessToken1.sessionId)).toBeTrue()
    expect(accessToken2.user).not.toEqual(undefined)
    expect(accessToken2.user!.id.equals(userReadMocks.id2)).toBeTrue()
  })

  it('signs out', async () => {
    const tokens1 = await service.refreshTokens('')
    const accessToken1 = AccessToken.fromString(tokens1.accessToken, accessTokenSecret)

    const tokens2 = await service.handleGoogleSignIn('', accessToken1.sessionId.toString())
    const accessToken2 = AccessToken.fromString(tokens2.accessToken, accessTokenSecret)

    const tokens3 = await service.signOut(accessToken2.sessionId.toString())
    const accessToken3 = AccessToken.fromString(tokens3.accessToken, accessTokenSecret)

    expect(tokens3.accessToken).toBeDefined()
    expect(tokens3.refreshToken).toBeDefined()
    expect(accessToken3.sessionId.equals(accessToken1.sessionId)).toBeTrue()
    expect(accessToken3.user).toBeUndefined()
  })

  afterAll(async () => {
    await listener.disconnectAll()
  })
})
