import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IUserUpdatedEvent, IUserState } from '@cents-ideas/models';

export class UserUpdatedEvent extends Event<IUserUpdatedEvent> {
  static readonly eventName: string = UserEvents.UserUpdated;

  constructor(userId: string, username: string, pendingEmail: string | null) {
    super(UserUpdatedEvent.eventName, { username, pendingEmail }, userId);
  }

  static commit(state: IUserState, event: UserUpdatedEvent): IUserState {
    state.username = event.data.username || state.username;
    state.pendingEmail = event.data.pendingEmail;
    return state;
  }
}
