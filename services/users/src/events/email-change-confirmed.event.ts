import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IEmailChangeConfirmedEvent, IUserState } from '@cents-ideas/models';

export class EmailChangeConfirmedEvent extends Event<IEmailChangeConfirmedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeConfirmed;

  constructor(userId: string, newEmail: string) {
    super(EmailChangeConfirmedEvent.eventName, { newEmail }, userId);
  }

  static commit(state: IUserState, event: EmailChangeConfirmedEvent): IUserState {
    state.email = event.data.newEmail;
    state.pendingEmail = null;
    state.updatedAt = new Date().toUTCString();
    return state;
  }
}
