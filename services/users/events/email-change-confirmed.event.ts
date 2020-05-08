import { Event } from '@centsideas/event-sourcing';
import { UserEvents } from '@centsideas/enums';
import { IEmailChangeConfirmedEvent, IUserState } from '@centsideas/models';

export class EmailChangeConfirmedEvent extends Event<IEmailChangeConfirmedEvent> {
  static readonly eventName: string = UserEvents.EmailChangeConfirmed;

  constructor(userId: string, payload: IEmailChangeConfirmedEvent) {
    super(EmailChangeConfirmedEvent.eventName, payload, userId);
  }

  static commit(state: IUserState, event: EmailChangeConfirmedEvent): IUserState {
    state.email = event.data.newEmail;
    state.pendingEmail = '';
    state.updatedAt = event.timestamp;
    return state;
  }
}
