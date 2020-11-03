import 'reflect-metadata'

import {Id, Username, UserRole} from '@centsideas/common/types'
import {ESEvent, EventName, Snapshot} from '@centsideas/event-sourcing'
import {UserEvents} from '@centsideas/common/enums'

import {
  UserCreated,
  UserRenamed,
  RoleChanged,
  DeletionConfirmed,
  DeletionRequested,
} from './user.events'
import {User, UserState} from './user'
import {UserAlreadyDeleted} from './user.errors'

describe('user', () => {
  const id = Id.generate()
  const username = Username.fromString('ronny')
  const otherUsername = Username.fromString('schnack')
  const state0: UserState = {id: id.toString(), username: username.toString(), isDeleted: false}

  it('creates users', () => {
    const user = User.create(id, username)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new UserCreated(id.toString(), username.toString()))
    expect(user.currentState).toEqual(state0)
  })

  it('renames', () => {
    const user = User.create(id, username)
    user.rename(otherUsername)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new UserRenamed(otherUsername.toString()))
    expect(user.currentState).toEqual(state0)
  })

  it('changes roles', () => {
    const user = User.create(id, username)
    user.changeRole(UserRole.Admin())
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new RoleChanged(UserRole.Admin().toString()))
    expect(user.currentState).toEqual(state0)
  })

  it('requests deletion', () => {
    const user = User.create(id, username)
    user.requestDeletion()
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new DeletionRequested())
    expect(user.currentState).toEqual(state0)
  })

  it('confirms deletion', () => {
    const user = User.create(id, username)
    user.confirmDeletion()
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new DeletionConfirmed())
    expect(user.currentState).toEqual({...state0, isDeleted: true})
  })

  it('prevents actions when already deleted', () => {
    const user = User.create(id, username)
    user.requestDeletion()
    user.confirmDeletion()
    expect(() => user.rename(otherUsername)).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.changeRole(UserRole.Admin())).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.confirmDeletion()).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.requestDeletion()).toThrow(new UserAlreadyDeleted(id))
  })

  it('can be instantiated from events and optional snapshot', () => {
    const created = new ESEvent(
      EventName.fromString(UserEvents.Created),
      id,
      new UserCreated(id.toString(), username.toString()),
      1,
    )

    const renamed = new ESEvent(
      EventName.fromString(UserEvents.Renamed),
      id,
      new UserRenamed(otherUsername.toString()),
      2,
    )

    const deletionRequested = new ESEvent(
      EventName.fromString(UserEvents.DeletionRequested),
      id,
      new DeletionRequested(),
      3,
    )

    const deletionConfirmed = new ESEvent(
      EventName.fromString(UserEvents.DeletionConfirmed),
      id,
      new DeletionConfirmed(),
      4,
    )

    const events = [created, renamed, deletionRequested, deletionConfirmed]
    const state: UserState = {...state0, isDeleted: true}
    expect(User.buildFrom(events).currentState).toEqual(state)

    const snapshot = new Snapshot(id, 3, {...state, isDeleted: false})
    expect(User.buildFrom([deletionConfirmed], snapshot).currentState).toEqual(state)
  })
})
