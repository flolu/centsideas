import {injectable} from 'inversify';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {PersistedEvent, SessionModels} from '@centsideas/models';
import {UserId, Email, Timestamp} from '@centsideas/types';

import {UserService} from './user.service';

@injectable()
export class UserServer extends EventsHandler {
  consumerGroupName = 'centsideas.user';

  constructor(private service: UserService) {
    super();
  }

  @EventHandler(AuthenticationEventNames.SignInConfirmed)
  async signInConfirmed(event: PersistedEvent<SessionModels.SignInConfirmedData>) {
    if (!event.data.isSignUp) return;
    await this.service.create(
      UserId.fromString(event.data.userId),
      Email.fromString(event.data.email),
      Timestamp.fromString(event.data.confirmedAt),
    );
  }

  @EventHandler(AuthenticationEventNames.GoogleSignInConfirmed)
  async googleSignInConfirmed(event: PersistedEvent<SessionModels.GoogleSignInConfirmedData>) {
    if (!event.data.isSignUp) return;
    await this.service.create(
      UserId.fromString(event.data.userId),
      Email.fromString(event.data.email),
      Timestamp.fromString(event.data.confirmedAt),
    );
  }
}
