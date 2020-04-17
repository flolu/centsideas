import { EventEntity, ISnapshot } from '@cents-ideas/event-sourcing';
import { ILoginState } from '@cents-ideas/models';

import { loginCommitFunctions, LoginEvents } from './events';

export class Login extends EventEntity<ILoginState> {
  static initialState: ILoginState = {
    id: '',
    email: '',
    createdAt: null,
    confirmedAt: null,
    confirmedByUserId: '',
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
    login.pushEvents(new LoginEvents.LoginRequestedEvent(loginId, email, firstLogin));
    return login;
  }

  static createGoogleLogin(
    loginId: string,
    email: string,
    firstLogin: boolean,
    googleUserId: string,
  ) {
    const login = new Login();
    login.pushEvents(
      new LoginEvents.GoogleLoginRequestedEvent(loginId, email, firstLogin, googleUserId),
    );
    return login;
  }

  confirmLogin(loginId: string, userId: string) {
    this.pushEvents(new LoginEvents.LoginConfirmedEvent(loginId, userId));
    return this;
  }
}
