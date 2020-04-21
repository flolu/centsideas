import { Event } from '@centsideas/event-sourcing';
import { UserEvents } from '@centsideas/enums';
import { IEmailChangeConfirmedEvent, IUserState } from '@centsideas/models';

export class EmailChangeConfirmedEvent extends Event<IEmailChangeConfirmedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeConfirmed;

  constructor(userId: string, newEmail: string, oldEmail: string) {
    super(EmailChangeConfirmedEvent.eventName, { newEmail, oldEmail }, userId);
  }

  static commit(state: IUserState, event: EmailChangeConfirmedEvent): IUserState {
    state.email = event.data.newEmail;
    state.pendingEmail = null;
    state.updatedAt = event.timestamp;
    return state;
  }
}
