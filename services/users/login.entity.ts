import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { ILoginState } from '@cents-ideas/models';

import { loginCommitFunctions } from './events';
import { LoginRequestedEvent } from './events/login-requested.event';
import { LoginConfirmedEvent } from './events/login-confirmed.event';

export class Login extends EventEntity<ILoginState> {
  static initialState: ILoginState = {
    id: '',
    email: '',
    createdAt: null,
    confirmedAt: null,
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<ILoginState>) {
    super(loginCommitFunctions, (snapshot && snapshot.state) || Login.initialState);
    if (snapshot) {
      this.lastPersistedEventId = snapshot.lastEventId;
    }
  }

  static create(loginId: string, email: string, firstLogin: boolean): Login {
    const login = new Login();
    login.pushEvents(new LoginRequestedEvent(loginId, email, firstLogin));
    return login;
  }

  confirmLogin(loginId: string, userId: string) {
    this.pushEvents(new LoginConfirmedEvent(loginId, userId));
    return this;
  }
}
