import {Event} from '@centsideas/event-sourcing';
import {LoginEvents} from '@centsideas/enums';
import {ILoginRequestedEvent, ILoginState} from '@centsideas/models';

export class LoginRequestedEvent extends Event<ILoginRequestedEvent> {
  static readonly eventName: string = LoginEvents.LoginRequested;

  constructor(loginId: string, email: string, token: string, firstLogin: boolean) {
    super(LoginRequestedEvent.eventName, {email, firstLogin, token}, loginId);
  }

  static commit(state: ILoginState, event: LoginRequestedEvent): ILoginState {
    state.id = event.aggregateId;
    state.createdAt = event.timestamp;
    state.email = event.data.email;
    return state;
  }
}
