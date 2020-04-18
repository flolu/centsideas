import { EventEntity, ISnapshot } from '@centsideas/event-sourcing';
import { ILoginState } from '@centsideas/models';

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
    if (snapshot && snapshot.state) {
      super(loginCommitFunctions, snapshot.state);
      this.lastPersistedEventId = snapshot.lastEventId;
    } else super(loginCommitFunctions, Login.initialState);
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
