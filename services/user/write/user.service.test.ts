import 'reflect-metadata'
import {Container} from 'inversify'

import {DomainEvents, Environments, PrivateUserEvents, UserEvents} from '@centsideas/common/enums'
import {
  EventDispatcher,
  EventDispatcherMock,
  EventListener,
  EventListenerMock,
  MockEmitter,
} from '@centsideas/messaging'
import {
  InMemoryEventStore,
  SerializedPersistedESEvent,
  mongoEventStoreFactory,
  mongoEventStoreFactoryMock,
} from '@centsideas/event-sourcing'
import {MailingAdapter, UserReadAdapter} from '@centsideas/adapters'
import {MailingAdapterMock, UserReadAdapterMock, userReadMocks} from '@centsideas/adapters/testing'
import {Config} from '@centsideas/config'
import {expectAsyncError} from '@centsideas/testing'
import {UserRegistered} from '@centsideas/schema'
import {Email, UserRole} from '@centsideas/common/types'
import {classToObject} from '@centsideas/event-sourcing/testing'

import * as Events from '../user.events'
import * as PrivateEvents from '../private-user.events'
import {UserDeletionToken} from '../user-deletion.token'
import {UserService} from './user.service'
import {UserAlreadyDeleted} from '../user.errors'

describe('user service', () => {
  const container = new Container({skipBaseClassChecks: true})
  container.bind(Config).toSelf().inSingletonScope()
  container
    .bind(EventListener)
    .to(EventListenerMock as any)
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
  container
    .bind(EventDispatcher)
    .to(EventDispatcherMock as any)
    .inSingletonScope()
  container.bind(UserService).toSelf().inSingletonScope()
  container.bind(MockEmitter).toSelf().inSingletonScope()

  const config = container.get(Config)
  const deletionTokenSecret = 'secret'
  config.override('environment', Environments.UnitTesting)
  config.override('secrets.tokens.emailChange', '-')
  config.override('secrets.tokens.userDeletion', deletionTokenSecret)
  config.override('eventStore.url', '-')
  config.override('eventStore.user', '-')
  config.override('secrets.eventStore.password', '-')
  config.override('user.eventStore.userDbName', '-')
  config.override('user.eventStore.privateUserDbName', '-')
  config.override('user.eventStore.userSnapshotThreshold', 3)
  config.override('user.eventStore.privateUserSnapshotThreshold', 3)

  const service = container.get(UserService)
  const listener = container.get(EventListener)
  const userTopic = 'event-sourcing.user'
  const privateUserTopic = 'event-sourcing.privateUser'
  const otherEmail = Email.fromString('other@email.com')
  const {fakeUser1, id1, username1, username2} = userReadMocks

  beforeAll(async () => {
    const dispatcher = container.get(EventDispatcher)
    const payload: UserRegistered = {userId: fakeUser1.id, email: fakeUser1.email!}
    await dispatcher.dispatch(DomainEvents.UserRegistered, [
      {key: fakeUser1.id, value: JSON.stringify(payload)},
    ])
  })

  it('renames users', async () => {
    const eventListener = await listener.consume('', userTopic)
    const listenedEvents: SerializedPersistedESEvent[] = []
    eventListener.subscribe(data => listenedEvents.push(JSON.parse(data.message.value!.toString())))

    await service.rename(id1, username1)
    const events = await service.userEventStore.getStream(id1)
    const renamed = events.find(e => e.event.name.equalsString(UserEvents.Renamed))

    expect(renamed!.event.payload).toEqual(new Events.UserRenamed(username1.toString()))
    const expectedEvents = [renamed]
    expect(listenedEvents.map(e => e.payload)).toEqual(
      expectedEvents.map(e => classToObject(e!.event.payload)),
    )
  })

  it('changes roles of users', async () => {
    const eventListener = await listener.consume('', userTopic)
    const listenedEvents: SerializedPersistedESEvent[] = []
    eventListener.subscribe(data => listenedEvents.push(JSON.parse(data.message.value!.toString())))

    await service.changeRole(id1, UserRole.Admin())
    const events = await service.userEventStore.getStream(id1)
    const roleChanged = events.find(e => e.event.name.equalsString(UserEvents.RoleChanged))

    expect(roleChanged!.event.payload).toEqual(new Events.RoleChanged(UserRole.Admin().toString()))
    const expectedEvents = [roleChanged]
    expect(listenedEvents.map(e => e.payload)).toEqual(
      expectedEvents.map(e => classToObject(e!.event.payload)),
    )
  })

  it('updates user profiles', async () => {
    const eventListener = await listener.consume('', privateUserTopic)
    const listenedEvents: SerializedPersistedESEvent[] = []
    eventListener.subscribe(data => listenedEvents.push(JSON.parse(data.message.value!.toString())))

    const emailTokenStr = await service.updateProfile(id1, {
      avatar: fakeUser1.avatarUrl,
      bio: fakeUser1.bio,
      location: fakeUser1.location,
      email: fakeUser1.email,
      name: fakeUser1.displayName,
      website: fakeUser1.website,
    })
    expect(emailTokenStr).toBeUndefined()

    const events = await service.privateUserEventStore.getStream(id1)
    const avatar = events.find(e => e.event.name.equalsString(PrivateUserEvents.AvatarChanged))
    const bio = events.find(e => e.event.name.equalsString(PrivateUserEvents.BioUpdated))
    const location = events.find(e => e.event.name.equalsString(PrivateUserEvents.LocationChanged))
    const name = events.find(e => e.event.name.equalsString(PrivateUserEvents.DisplayNameChanged))
    const website = events.find(e => e.event.name.equalsString(PrivateUserEvents.WebsiteChanged))
    expect(avatar!.event.payload).toEqual(new PrivateEvents.AvatarChanged(fakeUser1.avatarUrl!))
    expect(bio!.event.payload).toEqual(new PrivateEvents.BioUpdated(fakeUser1.bio!))
    expect(location!.event.payload).toEqual(new PrivateEvents.LocationChanged(fakeUser1.location!))
    expect(name!.event.payload).toEqual(
      new PrivateEvents.DisplayNameChanged(fakeUser1.displayName!),
    )
    expect(website!.event.payload).toEqual(new PrivateEvents.WebsiteChanged(fakeUser1.website!))
    const expectedEvents = [avatar, bio, location, name, website]
    expect(listenedEvents.map(e => e.payload)).toEqual(
      expectedEvents.map(e => classToObject(e!.event.payload)),
    )
  })

  it('updates emails', async () => {
    const eventListener = await listener.consume('', privateUserTopic)
    const listenedEvents: SerializedPersistedESEvent[] = []
    eventListener.subscribe(data => listenedEvents.push(JSON.parse(data.message.value!.toString())))

    const emailTokenStr = await service.updateProfile(id1, {email: otherEmail.toString()})
    await service.confirmEmailChange(emailTokenStr!)

    const privateEvents = await service.privateUserEventStore.getStream(id1)
    const requested = privateEvents.find(e =>
      e.event.name.equalsString(PrivateUserEvents.EmailChangeRequested),
    )
    const confirmed = privateEvents.find(e =>
      e.event.name.equalsString(PrivateUserEvents.EmailChangeConfirmed),
    )

    expect(requested!.event.payload).toEqual(
      new PrivateEvents.EmailChangeRequested(otherEmail.toString()),
    )
    expect(confirmed!.event.payload).toEqual(new PrivateEvents.EmailChangeConfirmed())
    const expectedEvents = [requested, confirmed]
    expect(listenedEvents.map(e => e.payload)).toEqual(
      expectedEvents.map(e => classToObject(e!.event.payload)),
    )
  })

  it('deletes users', async () => {
    const eventListener = await listener.consume('', userTopic)
    const listenedEvents: SerializedPersistedESEvent[] = []
    eventListener.subscribe(data => listenedEvents.push(JSON.parse(data.message.value!.toString())))

    const deletionTokenStr = await service.requestDeletion(id1)
    const deletionToken = UserDeletionToken.fromString(deletionTokenStr!, deletionTokenSecret)
    await service.confirmDeletion(deletionTokenStr!)
    await expectAsyncError(() => service.rename(id1, username2), new UserAlreadyDeleted(id1))

    const events = await service.userEventStore.getStream(id1)
    const deletionRequested = events.find(e =>
      e.event.name.equalsString(UserEvents.DeletionRequested),
    )
    const deletionConfirmed = events.find(e =>
      e.event.name.equalsString(UserEvents.DeletionConfirmed),
    )
    const privateEvents = await service.privateUserEventStore.getStream(id1)

    expect(deletionToken.userId.equals(id1)).toBeTrue()
    expect(deletionRequested!.event.payload).toEqual(new Events.DeletionRequested())
    expect(deletionConfirmed!.event.payload).toEqual(new Events.DeletionConfirmed())
    expect(privateEvents.length).toEqual(0)
    const expectedEvents = [deletionRequested, deletionConfirmed]
    expect(listenedEvents.map(e => e.payload)).toEqual(
      expectedEvents.map(e => classToObject(e!.event.payload)),
    )
  })

  afterAll(async () => {
    await listener.disconnectAll()
  })
})
