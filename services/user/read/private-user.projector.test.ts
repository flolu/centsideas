import 'reflect-metadata'
import {Container} from 'inversify'
import {MongoMemoryServer} from 'mongodb-memory-server'

import {Email, Id, URL} from '@centsideas/common/types'
import {InMemoryEventStore} from '@centsideas/event-sourcing'
import {
  EventDispatcher,
  EventDispatcherMock,
  EventListener,
  EventListenerMock,
  MockEmitter,
} from '@centsideas/messaging'
import {Config} from '@centsideas/config'
import {UserWriteAdapter} from '@centsideas/adapters'
import {UserWriteAdapterMock} from '@centsideas/adapters/testing'

import {PrivateUserProjector, PrivateUserReadState} from './private-user.projector'
import {PrivateUser} from '../private-user'
import {Location} from '../location'
import {DisplayName} from '../display-name'
import {Bio} from '../bio'

describe('private user projector', () => {
  const container = new Container({skipBaseClassChecks: true})
  container.bind(Config).toSelf().inSingletonScope()
  container.bind(PrivateUserProjector).toSelf().inSingletonScope()
  container
    .bind(EventDispatcher)
    .to(EventDispatcherMock as any)
    .inSingletonScope()
  container.bind(MockEmitter).toSelf().inSingletonScope()
  container.bind(EventListener).to(EventListenerMock as any)
  container.bind(InMemoryEventStore).toSelf().inSingletonScope()
  container.bind(UserWriteAdapter).to(UserWriteAdapterMock as any)

  const eventStore = container.get(InMemoryEventStore)
  let projector: PrivateUserProjector
  let mongod: MongoMemoryServer

  const id = Id.generate()
  const email = Email.fromString('test@centsideas.com')
  const otherEmail = Email.fromString('ron@centsideas.com')
  const avatar = URL.fromString('https://images.centsideas.com/abc')
  const location = Location.fromString('Ort')
  const name = DisplayName.fromString('Ronny')
  const website = URL.fromString('ronny.com')
  const bio = Bio.fromString('Hi I am Ron')

  const cleanState = (state: PrivateUserReadState) => {
    state.updatedAt = ''
    state.createdAt = ''
    delete (state as any)._id
    return state
  }

  beforeAll(async () => {
    mongod = new MongoMemoryServer()
    const uri = await mongod.getUri()
    const dbName = await mongod.getDbName()

    const config = container.get(Config)
    config.override('readDatabase.user', 'testing')
    config.override('secrets.readDatabase.password', 'testing')
    config.override('userRead.database.name', dbName)
    config.override('readDatabase.url', uri.replace('mongodb://', ''))

    projector = container.get(PrivateUserProjector)
    await new Promise(res => setTimeout(() => res(), 100))
  })

  it('projects private user events into currnet state', async () => {
    const privateUser = PrivateUser.create(id, email)
    privateUser.changeAvatar(avatar)
    privateUser.changeDisplayName(name)
    privateUser.changeLocation(location)
    privateUser.changeWebsite(website)
    privateUser.updateBio(bio)
    privateUser.requestEmailChange(otherEmail)

    await eventStore.store(privateUser)
    await new Promise(res => setTimeout(() => res(), 100))

    const state1 = cleanState((await projector.getById(id))!)
    const userState = {
      id: id.toString(),
      avatarUrl: avatar.toString(),
      displayName: name.toString(),
      bio: bio.toString(),
      location: location.toString(),
      website: website.toString(),
      email: email.toString(),
      pendingEmail: otherEmail.toString(),
      createdAt: '',
      updatedAt: '',
    }
    expect(state1).toEqual(userState)

    const state2 = cleanState((await projector.getByEmail(email))!)
    expect(state2).toEqual(userState)

    const events2 = await eventStore.getStream(id)
    const privateUser2 = PrivateUser.buildFrom(events2.map(e => e.event))
    privateUser2.confirmEmailChange()

    await eventStore.store(privateUser2)
    await new Promise(res => setTimeout(() => res(), 100))

    const state3 = cleanState((await projector.getById(id))!)
    expect(state3).toEqual({
      id: id.toString(),
      avatarUrl: avatar.toString(),
      displayName: name.toString(),
      bio: bio.toString(),
      location: location.toString(),
      website: website.toString(),
      email: otherEmail.toString(),
      pendingEmail: '',
      createdAt: '',
      updatedAt: '',
    })

    const events3 = await eventStore.getStream(id)
    const privateUser3 = PrivateUser.buildFrom(events3.map(e => e.event))
    privateUser3.delete()

    await eventStore.store(privateUser3)
    await new Promise(res => setTimeout(() => res(), 100))

    const userState3 = await projector.getById(id)
    expect(userState3 as any).toEqual(null)
  })

  afterAll(async () => {
    await mongod.stop()
  })
})
