import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { IUserState } from '@cents-ideas/models';

import { UserNotFoundError } from './errors';
import { commitFunctions } from './events';
import { UserUpdatedEvent } from './events/user-updated.event';
import { UserCreatedEvent } from './events/user-created.event';

export class User extends EventEntity<IUserState> {
  static initialState: IUserState = {
    id: '',
    username: '',
    email: '',
    pendingEmail: null,
    createdAt: null,
    updatedAt: null,
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<IUserState>) {
    super(commitFunctions, (snapshot && snapshot.state) || User.initialState, UserNotFoundError);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }

  static create(userId: string, email: string): User {
    const user = new User();
    user.pushEvents(new UserCreatedEvent(userId, email));
    return user;
  }

  update(username: string, pendingEmail: string | null) {
    this.pushEvents(new UserUpdatedEvent(this.persistedState.id, username, pendingEmail));
    return this;
  }
}