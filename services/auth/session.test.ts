import 'reflect-metadata'

import {Id} from '@centsideas/common/types'
import {SessionEvents} from '@centsideas/common/enums'
import {ESEvent, EventName, Snapshot} from '@centsideas/event-sourcing'
import {RefreshToken} from '@centsideas/shared'

import {Session, SessionState} from './session'
import * as Events from './session.events'
import * as Errors from './session.errors'

describe('session', () => {
  const id = Id.generate()
  const userId = Id.generate()
  const state0: SessionState = {id: id.toString(), isSignedIn: false, tokenRefreshCount: 0}

  it('starts a new sesion', () => {
    const session = Session.start(id)
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.SessionStarted(id.toString()))
    expect(session.currentState).toEqual(state0)
  })

  it('requests email sign in', () => {
    const session = Session.start(id)
    session.requestEmailSignIn()
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.EmailSignInRequested())
    expect(session.currentState).toEqual(state0)
  })

  it('confirms email sign in', () => {
    const session = Session.start(id)
    session.requestEmailSignIn()
    session.confirmEmailSignIn(userId)
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.EmailSignInConfirmed(userId.toString()))
    expect(session.currentState).toEqual({...state0, isSignedIn: true})
  })

  it('confirms google sign in', () => {
    const session = Session.start(id)
    session.confirmGoogleSignIn(userId)
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.GoogleSignInConfirmed(userId.toString()))
    expect(session.currentState).toEqual({...state0, isSignedIn: true})
  })

  it('refreshes tokens', () => {
    const session = Session.start(id)
    const token = new RefreshToken(id, 0)
    session.refreshTokens(token)
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.TokensRefreshed())
    expect(session.currentState).toEqual({...state0, tokenRefreshCount: 1})
  })

  it('revokes refresh tokens', () => {
    const session = Session.start(id)
    const token = new RefreshToken(id, 0)
    session.refreshTokens(token)
    session.revokeRefreshToken()
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.RefreshTokenRevoked())
    expect(() => session.refreshTokens(token)).toThrow(new Errors.SessionRevoked())
    expect(session.currentState).toEqual({...state0, tokenRefreshCount: 2})
  })

  it('signs out', () => {
    const session = Session.start(id)
    session.confirmGoogleSignIn(userId)
    session.signOut()
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.SignedOut())
    expect(session.currentState).toEqual(state0)
  })

  it('can not sign out if not signed in', () => {
    const session = Session.start(id)
    expect(() => session.signOut()).toThrow(new Errors.NotSignedIn())
  })

  it('can sign in if already singed in', () => {
    const session = Session.start(id)
    session.confirmGoogleSignIn(userId)
    session.confirmEmailSignIn(userId)
    const events = session.flushEvents().toPayloads()

    expect(events).toContain(new Events.EmailSignInConfirmed(userId.toString()))
    expect(session.currentState).toEqual({...state0, isSignedIn: true})
  })

  it('can be instantiated from events and optional snapshot', () => {
    const started = new ESEvent(
      EventName.fromString(SessionEvents.Started),
      id,
      new Events.SessionStarted(id.toString()),
      1,
    )
    const tokensRefreshed1 = new ESEvent(
      EventName.fromString(SessionEvents.TokensRefreshed),
      id,
      new Events.TokensRefreshed(),
      2,
    )
    const signInRequested = new ESEvent(
      EventName.fromString(SessionEvents.EmailSignInRequested),
      id,
      new Events.EmailSignInRequested(),
      3,
    )
    const signInConfirmed = new ESEvent(
      EventName.fromString(SessionEvents.EmailSignInConfirmed),
      id,
      new Events.EmailSignInConfirmed(userId.toString()),
      4,
    )
    const tokensRefreshed2 = new ESEvent(
      EventName.fromString(SessionEvents.TokensRefreshed),
      id,
      new Events.TokensRefreshed(),
      5,
    )
    const signedOut = new ESEvent(
      EventName.fromString(SessionEvents.SignedOut),
      id,
      new Events.SignedOut(),
      6,
    )

    const events = [
      started,
      tokensRefreshed1,
      signInRequested,
      signInConfirmed,
      tokensRefreshed2,
      signedOut,
    ]

    const state: SessionState = {...state0, tokenRefreshCount: 2}
    expect(Session.buildFrom(events).currentState).toEqual(state)

    const snapshot = new Snapshot(id, 5, {...state, isSignedIn: true})
    expect(Session.buildFrom([signedOut], snapshot).currentState).toEqual(state)
  })
})
