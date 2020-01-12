import { Event } from '@cents-ideas/event-sourcing';
import { LoginEvents } from '@cents-ideas/enums';
import { ILoginMailSentEvent, ILoginState } from '@cents-ideas/models';

export class LoginMailSent extends Event<ILoginMailSentEvent> {
  static readonly eventName: string = LoginEvents.LoginMailSent;

  constructor(loginId: string) {
    super(LoginMailSent.eventName, {}, loginId);
  }

  static commit(state: ILoginState, _event: LoginMailSent): ILoginState {
    return state;
  }
}
