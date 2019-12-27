import * as faker from 'faker';

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
    state.username = faker.internet.userName().toLowerCase();
    return state;
  }
}
