import { Event } from '@centsideas/event-sourcing';
import { UserEvents } from '@centsideas/enums';
import { IUserState, IUserLoggedOutEvent } from '@centsideas/models';

export class UserLoggedOutEvent extends Event<IUserLoggedOutEvent> {
  static readonly eventName: string = UserEvents.UserLoggedOut;

  constructor(userId: string) {
    super(UserLoggedOutEvent.eventName, { userId }, userId);
  }

  static commit(state: IUserState, _event: UserLoggedOutEvent): IUserState {
    return state;
  }
}
