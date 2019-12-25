import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { IUserState } from '@cents-ideas/models';

import { UserNotFoundError } from './errors';
import { commitFunctions } from './events';

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
}
