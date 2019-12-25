import { Event } from '@cents-ideas/event-sourcing';
import { LoginEvents } from '@cents-ideas/enums';
import { ILoginConfirmedEvent, ILoginState } from '@cents-ideas/models';

export class LoginConfirmed extends Event<ILoginConfirmedEvent> {
  static readonly eventName: string = LoginEvents.LoginConfirmed;

  constructor(loginId: string) {
    super(LoginConfirmed.eventName, {}, loginId);
  }

  static commit(state: ILoginState, _event: LoginConfirmed): ILoginState {
    return state;
  }
}
