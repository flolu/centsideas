import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';

import {Username} from './username';

@DomainEvent(UserEventNames.Renamed)
export class UserRenamed implements IDomainEvent {
  constructor(public readonly username: Username) {}

  serialize(): UserModels.UserRenamedData {
    return {
      username: this.username.toString(),
    };
  }

  deserialize({username}: UserModels.UserRenamedData) {
    return new UserRenamed(Username.fromString(username));
  }
}
