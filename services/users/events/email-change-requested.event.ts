import { Event } from '@centsideas/event-sourcing';
import { UserEvents } from '@centsideas/enums';
import { IEmailChangeRequestedEvent, IUserState } from '@centsideas/models';

export class EmailChangeRequestedEvent extends Event<IEmailChangeRequestedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeRequested;

  constructor(userId: string, payload: IEmailChangeRequestedEvent) {
    super(EmailChangeRequestedEvent.eventName, payload, userId);
  }

  static commit(state: IUserState, event: EmailChangeRequestedEvent): IUserState {
    state.pendingEmail = event.data.email;
    return state;
  }
}
