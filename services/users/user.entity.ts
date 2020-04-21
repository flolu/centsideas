import { EventEntity, ISnapshot, initialEntityBaseState } from '@centsideas/event-sourcing';
import { IUserState } from '@centsideas/models';

import { commitFunctions, UserEvents } from './events';

export class User extends EventEntity<IUserState> {
  static initialState: IUserState = {
    ...initialEntityBaseState,
    username: '',
    email: '',
    pendingEmail: null,
    createdAt: null,
    updatedAt: null,
    refreshTokenId: '',
  };

  constructor(snapshot?: ISnapshot<IUserState>) {
    if (snapshot && snapshot.state) {
      super(commitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(commitFunctions, User.initialState);
  }

  static create(userId: string, email: string, username: string, tokenId: string): User {
    const user = new User();
    user.pushEvents(new UserEvents.UserCreatedEvent(userId, email, username, tokenId));
    return user;
  }

  update(username: string | null, pendingEmail: string | null) {
    if (!username && !pendingEmail) return this;
    this.pushEvents(new UserEvents.UserUpdatedEvent(this.currentState.id, username, pendingEmail));
    return this;
  }

  confirmEmailChange(newEmail: string, oldEmail: string) {
    this.pushEvents(
      new UserEvents.EmailChangeConfirmedEvent(this.currentState.id, newEmail, oldEmail),
    );
    return this;
  }

  revokeRefreshToken(newRefreshToken: string, reason: string) {
    this.pushEvents(
      new UserEvents.RefreshTokenRevokedEvent(this.currentState.id, newRefreshToken, reason),
    );
    return this;
  }

  requestEmailChange(newEmail: string, token: string) {
    this.pushEvents(
      new UserEvents.EmailChangeRequestedEvent(this.currentState.id, newEmail, token),
    );
    return this;
  }
}
