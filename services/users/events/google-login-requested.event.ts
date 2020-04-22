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
    // FIXME consider adding  the google user id to the login state (but this is probably not that important since it is saved on the event if we would really need it later)
    /**
     * {
     *    oauth: {
     *        googleId: string;
     *    }
     * }
     */
    return state;
  }
}
