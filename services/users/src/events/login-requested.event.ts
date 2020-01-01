import { Event } from '@cents-ideas/event-sourcing';
import { LoginEvents } from '@cents-ideas/enums';
import { ILoginRequestedEvent, ILoginState } from '@cents-ideas/models';

export class LoginRequestedEvent extends Event<ILoginRequestedEvent> {
  static readonly eventName: string = LoginEvents.LoginRequested;

  constructor(loginId: string, email: string) {
    super(LoginRequestedEvent.eventName, { email }, loginId);
  }

  static commit(state: ILoginState, event: LoginRequestedEvent): ILoginState {
    state.id = event.aggregateId;
    state.createdAt = event.timestamp;
    state.email = event.data.email;
    return state;
  }
}
