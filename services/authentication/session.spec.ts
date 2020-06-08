import 'reflect-metadata';
import {PersistedEvent, SessionModels} from '@centsideas/models';
import {EventId, PersistedSnapshot} from '@centsideas/event-sourcing';
import {SessionId, ISODate, Email, UserId} from '@centsideas/types';
import {AuthenticationEventNames} from '@centsideas/enums';

import {Session, SerializedSession} from './session';
import {SignInMethods, SignInMethod} from './sign-in-method';
import * as Errors from './session.errors';
import {SignInRequested} from './sign-in-requested';
import {SignInConfirmed} from './sign-in-confirmed';
import {TokensRefreshed} from './access-token-refreshed';
import {SignedOut} from './signed-out';
import {RefreshTokenRevoked} from './refresh-token-revoked';

describe('Sesstion', () => {
  const id = SessionId.generate();
  const timestamp = ISODate.now();
  const email = Email.fromString('hello@centsideas.com');
  const user = UserId.generate();

  let version = 1;
  const requested: PersistedEvent<SessionModels.SignInRequestedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: AuthenticationEventNames.SignInRequested,
    data: {
      sessionId: id.toString(),
      method: SignInMethods.Email,
      email: email.toString(),
      requestedAt: timestamp.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const confirmed: PersistedEvent<SessionModels.SignInConfirmedData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: AuthenticationEventNames.SignInConfirmed,
    data: {
      isSignUpSession: true,
      userId: user.toString(),
      confirmedAt: timestamp.toString(),
    },
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const refreshed: PersistedEvent = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: AuthenticationEventNames.TokensRefreshed,
    data: {},
    insertedAt: timestamp.toString(),
    sequence: version,
  };
  version++;
  const signedOut: PersistedEvent<SessionModels.SignedOutData> = {
    id: EventId.generate().toString(),
    streamId: id.toString(),
    version,
    name: AuthenticationEventNames.SignedOut,
    data: {signedOutAt: timestamp.toString()},
    insertedAt: timestamp.toString(),
    sequence: version,
  };

  it('can be instantiated from events', () => {
    const events: PersistedEvent[] = [requested, confirmed, refreshed, signedOut];
    const session = Session.buildFrom(events);

    expect(session.persistedAggregateVersion).toEqual(events.length);
    expect(session.aggregateVersion).toEqual(events.length);
    expect(session.aggregateId.equals(id)).toEqual(true);

    const snapshot: PersistedSnapshot<SerializedSession> = {
      aggregateId: id.toString(),
      version,
      data: {
        id: id.toString(),
        signInRequestedAt: timestamp.toString(),
        signInMethod: SignInMethods.Email,
        isSignUpSession: true,
        signInConfirmedAt: timestamp.toString(),
        userId: user.toString(),
        signedOutAt: timestamp.toString(),
        isRefreshTokenRevoked: false,
      },
    };
    expect(session.snapshot).toEqual(snapshot);
  });

  it('can be instantiated from events and a snapshots', () => {
    const events: PersistedEvent[] = [refreshed, signedOut];
    const snapshot: PersistedSnapshot<SerializedSession> = {
      aggregateId: id.toString(),
      data: {
        id: id.toString(),
        signInRequestedAt: timestamp.toString(),
        signInMethod: SignInMethods.Email,
        isSignUpSession: true,
        signInConfirmedAt: timestamp.toString(),
        userId: user.toString(),
        signedOutAt: undefined,
        isRefreshTokenRevoked: false,
      },
      version: version - events.length,
    };

    const session = Session.buildFrom(events, snapshot);

    expect(session.persistedAggregateVersion).toEqual(version);
    expect(session.aggregateVersion).toEqual(version);
    expect(session.aggregateId.equals(id)).toEqual(true);

    const updatedSnapshot: PersistedSnapshot<SerializedSession> = {
      aggregateId: id.toString(),
      data: {
        id: id.toString(),
        signInRequestedAt: timestamp.toString(),
        signInMethod: SignInMethods.Email,
        isSignUpSession: true,
        signInConfirmedAt: timestamp.toString(),
        userId: user.toString(),
        signedOutAt: timestamp.toString(),
        isRefreshTokenRevoked: false,
      },
      version,
    };
    expect(session.snapshot).toEqual(updatedSnapshot);
  });

  it('blocks actions if not confirmed yet', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    expect(() => session.refreshTokens()).toThrowError(new Errors.SessionUnconfirmed());
    expect(() => session.signOut(timestamp)).toThrowError(new Errors.SessionUnconfirmed());
  });

  it('requests an email sign in', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    expect(session.flushEvents().toEvents()).toContainEqual(
      new SignInRequested(id, SignInMethod.fromString(SignInMethods.Email), email, timestamp),
    );
  });

  it('confirms an email sign in', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    expect(session.flushEvents().toEvents()).toContainEqual(
      new SignInConfirmed(true, user, timestamp),
    );
  });

  it('confirms an email sign in only once', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    expect(() => session.confirmEmailSignIn(user, true, timestamp)).toThrowError(
      new Errors.SessionAlreadyConfirmed(),
    );
  });

  /* // TODO implement it('requests a google sign in', () => {});
  it('confirms a google sign in', () => {});
  it('confirms a google sign in only once', () => {}); */

  it('refreshes tokens', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    session.refreshTokens();
    expect(session.flushEvents().toEvents()).toContainEqual(new TokensRefreshed());
  });

  it('signs out', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    session.signOut(timestamp);
    expect(session.flushEvents().toEvents()).toContainEqual(new SignedOut(timestamp));
  });

  it('blocks all actions after being signed out', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    session.signOut(timestamp);
    expect(() => session.refreshTokens()).toThrowError(new Errors.SessionSignedOut());
  });

  it('revokes refresh token', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    session.revokeRefreshToken();
    expect(session.flushEvents().toEvents()).toContainEqual(new RefreshTokenRevoked());
  });

  it('blocks all actions after being revoked', () => {
    const session = Session.requestEmailSignIn(id, email, timestamp);
    session.confirmEmailSignIn(user, true, timestamp);
    session.revokeRefreshToken();
    expect(() => session.refreshTokens()).toThrowError(new Errors.SessionRevoked());
  });
});
