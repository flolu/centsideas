import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IEmailChangeConfirmedEvent, IUserState } from '@cents-ideas/models';

export class EmailChangeConfirmed extends Event<IEmailChangeConfirmedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeConfirmed;

  constructor(userId: string, newEmail: string) {
    super(EmailChangeConfirmed.eventName, { newEmail }, userId);
  }

  static commit(state: IUserState, event: EmailChangeConfirmed): IUserState {
    state.email = event.data.newEmail;
    state.pendingEmail = null;
    state.updatedAt = new Date().toUTCString();
    return state;
  }
}
