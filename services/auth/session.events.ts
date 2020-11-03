import {SessionEvents} from '@centsideas/common/enums'
import {Event} from '@centsideas/event-sourcing'

@Event(SessionEvents.Started)
export class SessionStarted {
  constructor(public readonly sessionId: string) {}
}

@Event(SessionEvents.RefreshTokenRevoked)
export class RefreshTokenRevoked {}

@Event(SessionEvents.GoogleSignInConfirmed)
export class GoogleSignInConfirmed {
  constructor(public readonly userId: string) {}
}

@Event(SessionEvents.EmailSignInRequested)
export class EmailSignInRequested {}

@Event(SessionEvents.EmailSignInConfirmed)
export class EmailSignInConfirmed {
  constructor(public readonly userId: string) {}
}

@Event(SessionEvents.SignedOut)
export class SignedOut {}

@Event(SessionEvents.TokensRefreshed)
export class TokensRefreshed {}
