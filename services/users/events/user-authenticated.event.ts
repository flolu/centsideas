import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IUserAuthenticatedEvent, IUserState } from '@cents-ideas/models';

// FIXME just store date and userid in seperate in a small AuthEntity (this information may be userful later on)
export class UserAuthenticatedEvent extends Event<IUserAuthenticatedEvent> {
  static readonly eventName: string = UserEvents.UserAuthenticated;

  constructor(userId: string) {
    super(UserAuthenticatedEvent.eventName, {}, userId);
  }

  static commit(state: IUserState, _event: UserAuthenticatedEvent): IUserState {
    return state;
  }
}
