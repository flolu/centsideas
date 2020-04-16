import { Event } from '@cents-ideas/event-sourcing';
import { LoginEvents } from '@cents-ideas/enums';
import { ILoginConfirmedEvent, ILoginState } from '@cents-ideas/models';

export class LoginConfirmedEvent extends Event<ILoginConfirmedEvent> {
  static readonly eventName: string = LoginEvents.LoginConfirmed;

  constructor(loginId: string, userId: string) {
    super(LoginConfirmedEvent.eventName, { userId }, loginId);
  }

  static commit(state: ILoginState, event: LoginConfirmedEvent): ILoginState {
    state.confirmedAt = event.timestamp;
    state.confirmedByUserId = event.data.userId;
    return state;
  }
}
