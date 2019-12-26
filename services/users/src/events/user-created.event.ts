import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IUserState, IUserCreatedEvent } from '@cents-ideas/models';

export class UserCreatedEvent extends Event<IUserCreatedEvent> {
  static readonly eventName: string = UserEvents.UserCreated;

  constructor(userId: string, email: string) {
    super(UserCreatedEvent.eventName, { userId, email }, userId);
  }

  static commit(state: IUserState, event: UserCreatedEvent): IUserState {
    state.id = event.aggregateId;
    state.updatedAt = new Date().toISOString();
    state.email = event.data.email;
    // TODO generate random username based on email address
    state.username = 'default-username';
    return state;
  }
}
