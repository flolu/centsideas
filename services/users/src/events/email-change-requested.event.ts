import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IEmailChangeRequestedEvent, IUserState } from '@cents-ideas/models';

export class EmailChangeRequested extends Event<IEmailChangeRequestedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeConfirmed;

  constructor(userId: string, email: string) {
    super(EmailChangeRequested.eventName, { email }, userId);
  }

  static commit(state: IUserState, event: EmailChangeRequested): IUserState {
    state.pendingEmail = event.data.email;
    return state;
  }
}
