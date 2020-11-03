import 'reflect-metadata'
import {Container} from 'inversify'
import {MongoMemoryServer} from 'mongodb-memory-server'

import {Id, Username, UserRole} from '@centsideas/common/types'
import {InMemoryEventStore} from '@centsideas/event-sourcing'
import {Config} from '@centsideas/config'
import {
  EventDispatcher,
  EventDispatcherMock,
  MockEmitter,
  EventListener,
  EventListenerMock,
} from '@centsideas/messaging'
import {UserWriteAdapter} from '@centsideas/adapters'
import {UserWriteAdapterMock} from '@centsideas/adapters/testing'

import {User} from '../user'
import {UserProjector, UserReadState} from './user.projector'

// TODO don't extend MongoProjector to test UserProjector without mongodb

describe('user projector', () => {
  const container = new Container({skipBaseClassChecks: true})
  container.bind(Config).toSelf().inSingletonScope()
  container.bind(UserProjector).toSelf().inSingletonScope()
  container.bind(EventDispatcher).to(EventDispatcherMock as any)
  container.bind(EventListener).to(EventListenerMock as any)
  container.bind(MockEmitter).toSelf().inSingletonScope()
  container.bind(InMemoryEventStore).toSelf()
  container.bind(UserWriteAdapter).to(UserWriteAdapterMock as any)

  const eventStore = container.get(InMemoryEventStore)
  let projector: UserProjector
  let mongod: MongoMemoryServer

  const id = Id.generate()
  const username = Username.fromString('ronny')
  const otherUsername = Username.fromString('ronny2')

  const cleanState = (state: UserReadState) => {
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

    projector = container.get(UserProjector)
    await new Promise(res => setTimeout(() => res(), 100))
  })

  it('projects user events into current state', async () => {
    const user = User.create(id, username)
    user.changeRole(UserRole.Admin())
    user.rename(otherUsername)

    await eventStore.store(user)
    await new Promise(res => setTimeout(() => res(), 100))

    const userState = {
      id: id.toString(),
      username: otherUsername.toString(),
      role: UserRole.Admin().toString(),
      updatedAt: '',
      createdAt: '',
    }
    const state1 = cleanState((await projector.getById(id))!)
    expect(state1).toEqual(userState)

    const state2 = cleanState((await projector.getByUsername(otherUsername))!)
    expect(state2).toEqual(userState)

    const events = await eventStore.getStream(id)
    const user2 = User.buildFrom(events.map(e => e.event))
    user2.requestDeletion()
    user2.confirmDeletion()

    await eventStore.store(user2)
    await new Promise(res => setTimeout(() => res(), 100))

    const state3 = await projector.getById(id)
    expect(state3 as any).toEqual(null)
  })

  afterAll(async () => {
    await mongod.stop()
  })
})
