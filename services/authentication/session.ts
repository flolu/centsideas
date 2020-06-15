import {Aggregate, PersistedSnapshot, Apply} from '@centsideas/event-sourcing';
import {Timestamp, UserId, Email, SessionId} from '@centsideas/types';
import {PersistedEvent} from '@centsideas/models';

import {RefreshTokenRevoked} from './refresh-token-revoked';
import {SignInMethod, SignInMethods} from './sign-in-method';
import {TokensRefreshed} from './tokens-refreshed';
import {SignInRequested} from './sign-in-requested';
import {SignInConfirmed} from './sign-in-confirmed';
import * as Errors from './session.errors';
import {SignedOut} from './signed-out';
import {GoogleSignInConfirmed} from './google-sign-in-confirmed';

export interface SerializedSession {
  id: string;
  signInRequestedAt: string;
  signInMethod: string;
  isSignUpSession: boolean | undefined;
  signInConfirmedAt: string | undefined;
  userId: string | undefined;
  signedOutAt: string | undefined;
  isRefreshTokenRevoked: boolean;
}

export class Session extends Aggregate<SerializedSession> {
  protected id!: SessionId;
  private signInRequestedAt!: Timestamp;
  private signInMethod!: SignInMethod;
  private isSignUpSession: boolean | undefined;
  private userId: UserId | undefined;
  private signInConfirmedAt: Timestamp | undefined;
  private signedOutAt: Timestamp | undefined;
  private isRefreshTokenRevoked = false;

  static buildFrom(events: PersistedEvent[], snapshot?: PersistedSnapshot<SerializedSession>) {
    const session = new Session();
    if (snapshot) session.applySnapshot(snapshot, events);
    else session.replay(events);
    return session;
  }

  protected deserialize(data: SerializedSession) {
    this.id = SessionId.fromString(data.id);
    this.signInRequestedAt = Timestamp.fromString(data.signInRequestedAt);
    this.signInMethod = SignInMethod.fromString(data.signInMethod);
    this.isSignUpSession = data.isSignUpSession;
    this.userId = data.userId ? UserId.fromString(data.userId) : undefined;
    this.signInConfirmedAt = data.signInConfirmedAt
      ? Timestamp.fromString(data.signInConfirmedAt)
      : undefined;
    this.signedOutAt = data.signedOutAt ? Timestamp.fromString(data.signedOutAt) : undefined;
    this.isRefreshTokenRevoked = data.isRefreshTokenRevoked;
  }

  protected serialize(): SerializedSession {
    return {
      id: this.id.toString(),
      signInRequestedAt: this.signInRequestedAt.toString(),
      isSignUpSession: this.isSignUpSession,
      signInMethod: this.signInMethod.toString(),
      signInConfirmedAt: this.signInConfirmedAt?.toString(),
      userId: this.userId?.toString(),
      signedOutAt: this.signedOutAt?.toString(),
      isRefreshTokenRevoked: this.isRefreshTokenRevoked,
    };
  }

  static requestEmailSignIn(sessionId: SessionId, email: Email, requestedAt: Timestamp) {
    const session = new Session();
    const method = new SignInMethod(SignInMethods.Email);
    session.raise(new SignInRequested(sessionId, method, email, requestedAt));
    return session;
  }

  static googleSignIn(
    sessionId: SessionId,
    userId: UserId,
    email: Email,
    googleUserId: string,
    isSignUp: boolean,
    requestedAt: Timestamp,
    confirmedAt: Timestamp,
  ) {
    const session = new Session();
    session.raise(
      new GoogleSignInConfirmed(
        sessionId,
        userId,
        email,
        googleUserId,
        isSignUp,
        requestedAt,
        confirmedAt,
      ),
    );
    return session;
  }

  confirmEmailSignIn(userId: UserId, isSignUp: boolean, confirmedAt: Timestamp) {
    if (this.signInConfirmedAt) throw new Errors.SessionAlreadyConfirmed();
    if (this.isRefreshTokenRevoked) throw new Errors.SessionRevoked();
    this.raise(new SignInConfirmed(isSignUp, userId, confirmedAt));
  }

  refreshTokens() {
    if (!this.signInConfirmedAt) throw new Errors.SessionUnconfirmed();
    if (this.isRefreshTokenRevoked) throw new Errors.SessionRevoked();
    if (this.signedOutAt) throw new Errors.SessionSignedOut();
    this.raise(new TokensRefreshed());
  }

  signOut(signedOutAt: Timestamp) {
    if (!this.signInConfirmedAt) throw new Errors.SessionUnconfirmed();
    if (this.isRefreshTokenRevoked) throw new Errors.SessionRevoked();
    if (this.signedOutAt) throw new Errors.SessionSignedOut();
    this.raise(new SignedOut(signedOutAt));
  }

  revokeRefreshToken() {
    if (this.isRefreshTokenRevoked) throw new Errors.SessionRevoked();
    if (this.signedOutAt) throw new Errors.SessionSignedOut();
    this.raise(new RefreshTokenRevoked());
  }

  @Apply(SignInRequested)
  protected signInRequested(event: SignInRequested) {
    this.id = event.sessionId;
    this.signInRequestedAt = event.requestedAt;
    this.signInMethod = event.method;
  }

  @Apply(SignInConfirmed)
  protected signInConfirmed(event: SignInConfirmed) {
    this.isSignUpSession = event.isSignUpSession;
    this.userId = event.userId;
    this.signInConfirmedAt = event.confirmedAt;
  }

  @Apply(GoogleSignInConfirmed)
  protected googleSignInConfirmed(event: GoogleSignInConfirmed) {
    this.id = event.sessionId;
    this.signInMethod = new SignInMethod(SignInMethods.Google);
    this.signInRequestedAt = event.requestedAt;
    this.isSignUpSession = event.isSignUp;
    this.userId = event.userId;
    this.signInConfirmedAt = event.confirmedAt;
  }

  @Apply(SignedOut)
  protected signedOut(event: SignedOut) {
    this.signedOutAt = event.signedOutAt;
  }

  @Apply(RefreshTokenRevoked)
  protected refreshTokenRevoked() {
    this.isRefreshTokenRevoked = true;
  }
}
