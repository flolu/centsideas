import { Event } from '@centsideas/event-sourcing';
import { LoginEvents } from '@centsideas/enums';
import { IGoogleLoginRequestedEvnet, ILoginState } from '@centsideas/models';

export class GoogleLoginRequestedEvent extends Event<IGoogleLoginRequestedEvnet> {
  static readonly eventName: string = LoginEvents.GoogleLoginRequested;

  constructor(loginId: string, email: string, firstLogin: boolean, googleUserId: string) {
    super(GoogleLoginRequestedEvent.eventName, { email, firstLogin, googleUserId }, loginId);
  }

  static commit(state: ILoginState, event: GoogleLoginRequestedEvent): ILoginState {
    state.id = event.aggregateId;
    state.createdAt = event.timestamp;
    state.email = event.data.email;
    return state;
  }
}
