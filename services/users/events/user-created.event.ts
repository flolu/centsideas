import { Event } from '@centsideas/event-sourcing';
import { UserEvents } from '@centsideas/enums';
import { IUserState, IUserCreatedEvent } from '@centsideas/models';

export class UserCreatedEvent extends Event<IUserCreatedEvent> {
  static readonly eventName: string = UserEvents.UserCreated;

  constructor(userId: string, email: string, username: string, tokenId: string) {
    super(UserCreatedEvent.eventName, { userId, email, username, refreshTokenId: tokenId }, userId);
  }

  static commit(state: IUserState, event: UserCreatedEvent): IUserState {
    state.id = event.aggregateId;
    state.refreshTokenId = event.data.refreshTokenId;
    state.updatedAt = event.timestamp;
    state.createdAt = event.timestamp;
    state.email = event.data.email;
    state.username = event.data.username.toLowerCase();
    return state;
  }
}
