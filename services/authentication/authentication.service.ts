import {injectable, inject} from 'inversify';

import {
  MONGO_EVENT_STORE_FACTORY,
  MongoEventStoreFactory,
  MONGO_SNAPSHOT_STORE_FACTORY,
  MongoSnapshotStoreFactory,
} from '@centsideas/event-sourcing';
import {Email, ISODate, UserId, SessionId, AccessToken} from '@centsideas/types';
import {EventTopics, TokenExpirationTimes} from '@centsideas/enums';
import {PersistedEvent} from '@centsideas/models';
import {SecretsConfig} from '@centsideas/config';

import {Session} from './session';
import {EmailSignInToken} from './email-sign-in-token';
import {RefreshToken} from './refresh-token';
import {UserReadAdapter} from './user-read.adapter';
import {AuthenticationConfig} from './authentication.config';
import {serializeEvent} from '@centsideas/rpc';

@injectable()
export class AuthenticationService {
  private readonly refreshTokenSecret = this.secretesConfig.get('secrets.tokens.refresh');
  private readonly accessTokenSecret = this.secretesConfig.get('secrets.tokens.access');
  private readonly signInTokenSecret = this.secretesConfig.get('secrets.tokens.signin');
  private readonly databaseUrl = this.config.get('authentication.database.url');
  private readonly databaseName = this.config.get('authentication.database.name');
  private readonly snapshotDistance = 50;

  private eventStore = this.eventStoreFactory({
    url: this.databaseUrl,
    name: this.databaseName,
    topic: EventTopics.Authentication,
  });
  private snapshotStore = this.snapshotStoreFactory({
    url: this.databaseUrl,
    name: this.databaseName,
  });

  constructor(
    private secretesConfig: SecretsConfig,
    private config: AuthenticationConfig,
    private userReadAdapter: UserReadAdapter,
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
    @inject(MONGO_SNAPSHOT_STORE_FACTORY) private snapshotStoreFactory: MongoSnapshotStoreFactory,
  ) {}

  async requestEmailSignIn(emailString: string) {
    const sessionId = SessionId.generate();
    const email = Email.fromString(emailString);
    const session = Session.requestEmailSignIn(sessionId, email, ISODate.now());
    const _emailSignInToken = new EmailSignInToken(sessionId, email);
    // TODO send email with this token
    // console.log(emailSignInToken.sign(this.signInTokenSecret, TokenExpirationTimes.SignInToken));
    await this.store(session);
  }

  async confirmEmailSignIn(signInToken: string) {
    const {sessionId, email} = EmailSignInToken.fromString(signInToken, this.signInTokenSecret);
    const session = await this.build(sessionId);
    const existingUser = await this.userReadAdapter.getUserByEmail(email);
    const userId = (existingUser?.id as UserId) || UserId.generate();
    session.confirmEmailSignIn(userId, !existingUser, ISODate.now());
    await this.store(session);

    const accessToken = new AccessToken(sessionId, userId);
    const refreshToken = new RefreshToken(sessionId, userId);
    return {
      accessToken: accessToken.sign(this.accessTokenSecret, TokenExpirationTimes.AccessToken),
      refreshToken: refreshToken.sign(this.refreshTokenSecret, TokenExpirationTimes.RefreshToken),
      userId: userId.toString(),
    };
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
      accessToken: accessToken.sign(this.accessTokenSecret, TokenExpirationTimes.AccessToken),
      refreshToken: refreshToken.sign(this.refreshTokenSecret, TokenExpirationTimes.RefreshToken),
      userId: userId.toString(),
    };
  }

  async signOut(refreshToken: string) {
    const {sessionId} = RefreshToken.fromString(refreshToken, this.refreshTokenSecret);
    const session = await this.build(sessionId);
    session.signOut(ISODate.now());
    await this.store(session);
  }

  // FIXME this will only revoke token from current session (maybe later implement such that can be revoked for all sessions of a particular user)
  // FIXME only admins should be able to do this
  async revokeRefreshToken(sessionId: string) {
    const session = await this.build(SessionId.fromString(sessionId));
    session.revokeRefreshToken();
    await this.store(session);
  }

  async getEvents(after?: number) {
    const events = await this.eventStore.getEvents(after || -1);
    return events.map(serializeEvent);
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
