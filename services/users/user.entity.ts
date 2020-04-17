import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { IUserState } from '@cents-ideas/models';

import { commitFunctions, UserEvents } from './events';

export class User extends EventEntity<IUserState> {
  static initialState: IUserState = {
    id: '',
    username: '',
    email: '',
    pendingEmail: null,
    createdAt: null,
    updatedAt: null,
    refreshTokenId: '',
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<IUserState>) {
    super(commitFunctions, (snapshot && snapshot.state) || User.initialState);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }

  static create(userId: string, email: string, username: string, tokenId: string): User {
    const user = new User();
    user.pushEvents(new UserEvents.UserCreatedEvent(userId, email, username, tokenId));
    return user;
  }

  // TODO consider moving error handling (especially payload validation into events, so that they dont clutter command handlers)
  update(username: string | null, pendingEmail: string | null) {
    if (!username && !pendingEmail) return this;
    this.pushEvents(
      new UserEvents.UserUpdatedEvent(this.persistedState.id, username, pendingEmail),
    );
    return this;
  }

  confirmEmailChange(newEmail: string) {
    // TODO throw error if no persistet state found more generic
    if (!this.persistedState.id) throw new Error(`no persisted state found`);
    this.pushEvents(new UserEvents.EmailChangeConfirmedEvent(this.persistedState.id, newEmail));
    return this;
  }

  revokeRefreshToken(newRefreshToken: string, reason: string) {
    this.pushEvents(
      new UserEvents.RefreshTokenRevokedEvent(this.persistedState.id, newRefreshToken, reason),
    );
    return this;
  }
}
