import { EventEntity, ISnapshot, initialEntityBaseState } from '@centsideas/event-sourcing';
import {
  IUserState,
  IUserCreatedEvent,
  IUserUpdatedEvent,
  IEmailChangeConfirmedEvent,
  IRefreshTokenRevokedEvent,
  IEmailChangeRequestedEvent,
} from '@centsideas/models';

import { commitFunctions, UserEvents } from './events';

export class User extends EventEntity<IUserState> {
  static initialState: IUserState = {
    ...initialEntityBaseState,
    username: '',
    email: '',
    pendingEmail: '',
    createdAt: '',
    updatedAt: '',
    refreshTokenId: '',
  };

  constructor(snapshot?: ISnapshot<IUserState>) {
    if (snapshot && snapshot.state) {
      super(commitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(commitFunctions, User.initialState);
  }

  static create(payoad: IUserCreatedEvent): User {
    const user = new User();
    user.pushEvents(new UserEvents.UserCreatedEvent(payoad));
    return user;
  }

  update(payload: IUserUpdatedEvent) {
    if (!payload.username && !payload.pendingEmail) return this;
    this.pushEvents(new UserEvents.UserUpdatedEvent(this.currentState.id, payload));
    return this;
  }

  confirmEmailChange(payload: IEmailChangeConfirmedEvent) {
    this.pushEvents(new UserEvents.EmailChangeConfirmedEvent(this.currentState.id, payload));
    return this;
  }

  revokeRefreshToken(payload: IRefreshTokenRevokedEvent) {
    this.pushEvents(new UserEvents.RefreshTokenRevokedEvent(this.currentState.id, payload));
    return this;
  }

  requestEmailChange(payload: IEmailChangeRequestedEvent) {
    this.pushEvents(new UserEvents.EmailChangeRequestedEvent(this.currentState.id, payload));
    return this;
  }

  logout() {
    this.pushEvents(new UserEvents.UserLoggedOutEvent(this.currentState.id));
    return this;
  }
}
