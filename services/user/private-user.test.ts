import 'reflect-metadata'

import {Id, Email, URL} from '@centsideas/common/types'
import {PrivateUserEvents} from '@centsideas/common/enums'
import {ESEvent, EventName, Snapshot} from '@centsideas/event-sourcing'
import * as Events from './private-user.events'

import {PrivateUser, PrivateUserState} from './private-user'
import {Location} from './location'
import {DisplayName} from './display-name'
import {UserAlreadyDeleted} from './user.errors'
import {Bio} from './bio'

describe('private user', () => {
  const id = Id.generate()
  const email = Email.fromString('ronny@schnack.com')
  const otherEmail = Email.fromString('schnack@centsideas.com')
  const avatar = URL.fromString('https://images.centsideas.com/abc')
  const name = DisplayName.fromString('Ronny Schnackelmann')
  const location = Location.fromString('Ort')
  const website = URL.fromString('schnack.com', false)
  const bio = Bio.fromString('This is the best bio ever.')
  const state0: PrivateUserState = {
    id: id.toString(),
    isDeleted: false,
    email: email.toString(),
    pendingEmail: undefined,
    avatarUrl: undefined,
    bio: undefined,
    location: undefined,
    displayName: undefined,
    website: undefined,
  }

  it('creates private users', () => {
    const user = PrivateUser.create(id, email)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.PrivateUserCreated(id.toString(), email.toString()))
    expect(user.currentState).toEqual(state0)
  })

  it('changes avatar', () => {
    const user = PrivateUser.create(id, email)
    user.changeAvatar(avatar)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.AvatarChanged(avatar.toString()))
    expect(user.currentState).toEqual({...state0, avatarUrl: avatar.toString()})
  })

  it('changes display name', () => {
    const user = PrivateUser.create(id, email)
    user.changeDisplayName(name)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.DisplayNameChanged(name.toString()))
    expect(user.currentState).toEqual({...state0, displayName: name.toString()})
  })

  it('changes location', () => {
    const user = PrivateUser.create(id, email)
    user.changeLocation(location)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.LocationChanged(location.toString()))
    expect(user.currentState).toEqual({...state0, location: location.toString()})
  })

  it('changes website', () => {
    const user = PrivateUser.create(id, email)
    user.changeWebsite(website)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.WebsiteChanged(website.toString()))
    expect(user.currentState).toEqual({...state0, website: website.toString()})
  })

  it('updates bio', () => {
    const user = PrivateUser.create(id, email)
    user.updateBio(bio)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.BioUpdated(bio.toString()))
    expect(user.currentState).toEqual({...state0, bio: bio.toString()})
  })

  it('requests email change', () => {
    const user = PrivateUser.create(id, email)
    user.requestEmailChange(otherEmail)
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.EmailChangeRequested(otherEmail.toString()))
    expect(user.getEmail()).toEqual(email)
    expect(user.getPendingEmail()).toEqual(otherEmail)
    expect(user.currentState).toEqual({...state0, pendingEmail: otherEmail.toString()})
  })

  it('confirms email change', () => {
    const user = PrivateUser.create(id, email)
    user.requestEmailChange(otherEmail)
    user.confirmEmailChange()
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.EmailChangeConfirmed())
    expect(user.getEmail()).toEqual(otherEmail)
    expect(user.getPendingEmail()).toEqual(undefined)
    expect(user.currentState).toEqual({...state0, email: otherEmail.toString()})
  })

  it('deletes private users', () => {
    const user = PrivateUser.create(id, email)
    user.delete()
    const events = user.flushEvents().toPayloads()
    expect(events).toContain(new Events.PrivateUserDeleted())
    expect(user.currentState).toEqual({...state0, isDeleted: true})
  })

  it('prevents actions when already deleted', () => {
    const user = PrivateUser.create(id, email)
    user.delete()
    expect(() => user.changeAvatar(avatar)).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.changeDisplayName(name)).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.changeLocation(location)).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.changeWebsite(website)).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.confirmEmailChange()).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.delete()).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.requestEmailChange(otherEmail)).toThrow(new UserAlreadyDeleted(id))
    expect(() => user.updateBio(bio)).toThrow(new UserAlreadyDeleted(id))
  })

  it('can be instantiated from events and optional snapshot', () => {
    const created = new ESEvent(
      EventName.fromString(PrivateUserEvents.Created),
      id,
      new Events.PrivateUserCreated(id.toString(), email.toString()),
      1,
    )

    const updatedBio = new ESEvent(
      EventName.fromString(PrivateUserEvents.BioUpdated),
      id,
      new Events.BioUpdated(bio.toString()),
      2,
    )

    const deleted = new ESEvent(
      EventName.fromString(PrivateUserEvents.Deleted),
      id,
      new Events.PrivateUserDeleted(),
      3,
    )

    const events = [created, updatedBio, deleted]
    const state: PrivateUserState = {...state0, bio: bio.toString(), isDeleted: true}

    expect(PrivateUser.buildFrom(events).currentState).toEqual(state)

    const snapshot = new Snapshot(id, 2, {...state, isDeleted: false})
    expect(PrivateUser.buildFrom([deleted], snapshot).currentState).toEqual({
      ...state,
      isDeleted: true,
    })
  })
})
