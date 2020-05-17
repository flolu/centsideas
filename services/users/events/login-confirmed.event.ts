import {Event} from '@centsideas/event-sourcing';
import {LoginEvents} from '@centsideas/enums';
import {ILoginConfirmedEvent, ILoginState} from '@centsideas/models';

export class LoginConfirmedEvent extends Event<ILoginConfirmedEvent> {
  static readonly eventName: string = LoginEvents.LoginConfirmed;

  constructor(loginId: string, userId: string) {
    super(LoginConfirmedEvent.eventName, {userId}, loginId);
  }

  static commit(state: ILoginState, event: LoginConfirmedEvent): ILoginState {
    state.confirmedAt = event.timestamp;
    state.confirmedByUserId = event.data.userId;
    return state;
  }
}
