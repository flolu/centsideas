import {injectable, inject} from 'inversify';

import {
  MONGO_EVENT_STORE_FACTORY,
  MongoEventStoreFactory,
  MONGO_SNAPSHOT_STORE_FACTORY,
  MongoSnapshotStoreFactory,
} from '@centsideas/event-sourcing';
import {Email, ISODate, UserId, SessionId} from '@centsideas/types';
import {EventTopics} from '@centsideas/enums';
import {PersistedEvent} from '@centsideas/models';
import {SecretsConfig} from '@centsideas/config';

import {Session} from './session';
import {EmailSignInToken} from './email-sign-in-token';
import {RefreshToken} from './refresh-token';
import {AccessToken} from './access-token';
import {UserReadAdapter} from './user-read.adapter';

@injectable()
export class AuthenticationService {
  @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory!: MongoEventStoreFactory;
  @inject(MONGO_SNAPSHOT_STORE_FACTORY) private snapshotStoreFactory!: MongoSnapshotStoreFactory;

  private eventStore = this.eventStoreFactory({
    // TODO configure event store database
    url: '',
    name: '',
    topic: EventTopics.Authentication,
  });
  private snapshotStore = this.snapshotStoreFactory({
    url: '',
    name: '',
  });
  private readonly snapshotDistance = 50;

  private readonly refreshTokenSecret = this.secretesConfig.get('secrets.tokens.refresh');
  private readonly accessTokenSecret = this.secretesConfig.get('secrets.tokens.access');
  private readonly signInTokenSecret = this.secretesConfig.get('secrets.tokens.login');

  private accessTokenExpirationSeconds = 15 * 60;
  private refreshTokenExpirationSeconds = 7 * 24 * 60 * 60;

  constructor(private secretesConfig: SecretsConfig, private userReadAdapter: UserReadAdapter) {}

  async requestEmailSignIn(email: string) {
    const sessionId = SessionId.generate();
    const session = Session.requestEmailSignIn(sessionId, Email.fromString(email), ISODate.now());
    await this.store(session);
  }

  async confirmEmailSignIn(signInToken: string) {
    const {sessionId, email} = EmailSignInToken.fromString(signInToken, this.signInTokenSecret);
    const session = await this.build(sessionId);
    const existingUser = await this.userReadAdapter.getUserByEmail(email);
    const userId = existingUser?.id || UserId.generate();
    session.confirmEmailSignIn(userId, !existingUser);
    await this.store(session);

    const refreshToken = new RefreshToken(sessionId, userId);
    return {refreshToken: refreshToken.toString(), userId};
  }

  async refresTokens(currentRefreshToken: string) {
    const {sessionId, userId} = RefreshToken.fromString(
      currentRefreshToken,
      this.refreshTokenSecret,
    );
    const session = await this.build(sessionId);
    session.refreshTokens();
    await this.store(session);

    const accessToken = new AccessToken(sessionId, userId);
    const refreshToken = new RefreshToken(sessionId, userId);
    return {
      accessToken: accessToken.sign(this.accessTokenSecret, this.accessTokenExpirationSeconds),
      refreshToken: refreshToken.sign(this.refreshTokenSecret, this.refreshTokenExpirationSeconds),
    };
  }

  async signOut(sessionId: string) {
    const session = await this.build(SessionId.fromString(sessionId));
    session.signOut(ISODate.now());
    await this.store(session);
  }

  // FIXME tihs will only revoke token from current session (maybe later implement such that can be revoked for all sessions of a particular user)
  // FIXME only admins should be able to do this
  async revokeRefreshToken(sessionId: string) {
    const session = await this.build(SessionId.fromString(sessionId));
    session.revokeRefreshToken();
    await this.store(session);
  }

  private async build(id: SessionId) {
    const snapshot = await this.snapshotStore.get(id);
    const events: PersistedEvent[] = snapshot
      ? await this.eventStore.getStream(id, snapshot.version)
      : await this.eventStore.getStream(id);
    return Session.buildFrom(events, snapshot);
  }

  private async store(session: Session) {
    await this.eventStore.store(session.flushEvents(), session.persistedAggregateVersion);

    const snapshot = await this.snapshotStore.get(session.aggregateId);
    if (session.aggregateVersion - (snapshot?.version || 0) > this.snapshotDistance)
      await this.snapshotStore.store(session.snapshot);
  }
}
