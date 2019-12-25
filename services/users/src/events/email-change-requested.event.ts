import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IEmailChangeRequestedEvent, IUserState } from '@cents-ideas/models';

export class EmailChangeRequestedEvent extends Event<IEmailChangeRequestedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeConfirmed;

  constructor(userId: string, email: string) {
    super(EmailChangeRequestedEvent.eventName, { email }, userId);
  }

  static commit(state: IUserState, event: EmailChangeRequestedEvent): IUserState {
    state.pendingEmail = event.data.email;
    return state;
  }
}
