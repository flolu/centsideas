import {Aggregate, Apply, ESEvent, Snapshot} from '@centsideas/event-sourcing'
import {Id} from '@centsideas/common/types'
import {RefreshToken} from '@centsideas/shared'

import * as Events from './session.events'
import * as Errors from './session.errors'

export interface SessionState {
  id: string
  isSignedIn: boolean
  tokenRefreshCount: number
}

export class Session extends Aggregate<SessionState> {
  protected id!: Id
  private isSignedIn = false
  private tokenRefreshCount = 0

  static buildFrom(events: ESEvent[], snapshot?: Snapshot<SessionState>) {
    return Session.build(Session, events, snapshot)
  }

  static start(sessionId: Id) {
    const session = new Session()
    return session.raise(new Events.SessionStarted(sessionId.toString()))
  }

  requestEmailSignIn() {
    this.raise(new Events.EmailSignInRequested())
  }

  confirmEmailSignIn(userId: Id) {
    this.raise(new Events.EmailSignInConfirmed(userId.toString()))
  }

  confirmGoogleSignIn(userId: Id) {
    this.raise(new Events.GoogleSignInConfirmed(userId.toString()))
  }

  refreshTokens(refreshToken: RefreshToken) {
    if (refreshToken.count !== this.tokenRefreshCount) throw new Errors.SessionRevoked()
    this.raise(new Events.TokensRefreshed())
  }

  revokeRefreshToken() {
    this.raise(new Events.RefreshTokenRevoked())
  }

  signOut() {
    if (!this.isSignedIn) throw new Errors.NotSignedIn()
    this.raise(new Events.SignedOut())
  }

  applyState(state: SessionState) {
    this.isSignedIn = state.isSignedIn
    this.tokenRefreshCount = state.tokenRefreshCount
  }

  get currentState() {
    return {
      id: this.id.toString(),
      isSignedIn: this.isSignedIn,
      tokenRefreshCount: this.tokenRefreshCount,
    }
  }

  @Apply(Events.SessionStarted)
  private sessionStarted(payload: Events.SessionStarted) {
    this.id = Id.fromString(payload.sessionId)
  }

  @Apply(Events.TokensRefreshed)
  private tokensRefreshed() {
    this.tokenRefreshCount += 1
  }

  @Apply(Events.RefreshTokenRevoked)
  private refreshTokenRevoked() {
    this.tokenRefreshCount += 1
  }

  @Apply(Events.EmailSignInConfirmed)
  private emailSignInConfirmed() {
    this.isSignedIn = true
  }

  @Apply(Events.GoogleSignInConfirmed)
  private googleSignInConfirmed() {
    this.isSignedIn = true
  }

  @Apply(Events.SignedOut)
  private signedOut() {
    this.isSignedIn = false
  }
}
