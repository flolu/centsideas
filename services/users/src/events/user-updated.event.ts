import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IUserUpdatedEvent, IUserState } from '@cents-ideas/models';

export class UserUpdatedEvent extends Event<IUserUpdatedEvent> {
  static readonly eventName: string = UserEvents.UserUpdated;

  constructor(userId: string, username: string, email: string) {
    super(UserUpdatedEvent.eventName, { username, email }, userId);
  }

  static commit(state: IUserState, event: UserUpdatedEvent): IUserState {
    state.username = event.data.username || state.username;
    // TODO dispatch email change requested if necessary
    state.pendingEmail = state.email !== event.data.email ? event.data.email : null;
    return state;
  }
}
